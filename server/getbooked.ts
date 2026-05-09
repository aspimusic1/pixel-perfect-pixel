import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  BROWSE_PROFILES,
  DASHBOARD_SEEDS,
  DEAL_SEED,
  OFFER_SEEDS,
  ROLE_CONFIG,
  ROLE_ORDER,
  type BrowseRole,
  type OfferRecord,
  type OfferStatus,
  type ProfileCard,
  type Role,
} from "../shared/getbooked";
import { notifyOwner } from "./_core/notification";
import { sendTransactionalEmail } from "./email";

const roleSchema = z.enum(["artist", "promoter", "venue", "crew", "creative"]);

const browseInputSchema = z.object({
  role: z.enum(["all", "artist", "promoter", "venue", "crew", "creative"]).default("all"),
  city: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  venueType: z.string().trim().optional(),
  skill: z.string().trim().optional(),
  creativeType: z.string().trim().optional(),
  minScore: z.number().min(0).max(100).optional(),
  priceMax: z.number().positive().optional(),
  search: z.string().trim().optional(),
});

const inMemoryProfiles = new Map<string, { role: Role | null; onboardingComplete: boolean; profileCompletion: number }>();
const inMemoryOffers = new Map<string, OfferRecord>(OFFER_SEEDS.map(item => [item.id, item]));
const inMemoryNotifications = new Map<string, Array<{ id: string; title: string; body: string; actionUrl: string; createdAt: string }>>();

type ResolvedContact = {
  openId: string | null;
  email: string | null;
  displayName: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeEmail(value: unknown) {
  const normalized = normalizeText(value);
  return normalized && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized) ? normalized : null;
}

async function resolveContactByRoleAndName(role: Role, name: string): Promise<ResolvedContact | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const profileLookup = await supabase
    .from("user_profiles")
    .select("open_id, email, display_name, role")
    .eq("role", role)
    .eq("display_name", name)
    .limit(1)
    .maybeSingle();

  if (profileLookup.data) {
    return {
      openId: normalizeText(profileLookup.data.open_id),
      email: normalizeEmail(profileLookup.data.email),
      displayName: normalizeText(profileLookup.data.display_name) ?? name,
    };
  }

  const roleTable =
    role === "artist"
      ? "artist_profiles"
      : role === "venue"
        ? "venue_profiles"
        : role === "crew"
          ? "crew_profiles"
          : role === "creative"
            ? "creative_profiles"
            : null;

  if (!roleTable) return null;

  const fallbackLookup = await supabase.from(roleTable).select("*").eq("name", name).limit(1).maybeSingle();
  if (!fallbackLookup.data) return null;

  const row = fallbackLookup.data as Record<string, unknown>;

  return {
    openId: normalizeText(row.open_id),
    email: normalizeEmail(row.email ?? row.contact_email ?? row.booking_email),
    displayName: normalizeText(row.name ?? row.display_name) ?? name,
  };
}

function createOfferEmailHtml(params: { heading: string; intro: string; eventName: string; eventDate: string; venueName: string; city: string; feeLabel: string; depositLabel: string; actionUrl: string; }) {
  return `
    <div style="background:#080b11;padding:32px;font-family:Inter,Arial,sans-serif;color:#f3f5f7;">
      <div style="max-width:640px;margin:0 auto;background:#101521;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:32px;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#c8ff3e;margin-bottom:12px;">GetBooked.Live</div>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">${params.heading}</h1>
        <p style="margin:0 0 24px;color:#b6bfcc;line-height:1.7;">${params.intro}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:10px 0;color:#8f9bad;">Event</td><td style="padding:10px 0;text-align:right;">${params.eventName}</td></tr>
          <tr><td style="padding:10px 0;color:#8f9bad;">Date</td><td style="padding:10px 0;text-align:right;">${params.eventDate}</td></tr>
          <tr><td style="padding:10px 0;color:#8f9bad;">Venue</td><td style="padding:10px 0;text-align:right;">${params.venueName}</td></tr>
          <tr><td style="padding:10px 0;color:#8f9bad;">City</td><td style="padding:10px 0;text-align:right;">${params.city}</td></tr>
          <tr><td style="padding:10px 0;color:#8f9bad;">Fee</td><td style="padding:10px 0;text-align:right;">${params.feeLabel}</td></tr>
          <tr><td style="padding:10px 0;color:#8f9bad;">Deposit</td><td style="padding:10px 0;text-align:right;">${params.depositLabel}</td></tr>
        </table>
        <a href="${params.actionUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#c8ff3e;color:#081011;text-decoration:none;font-weight:700;">Open in GetBooked</a>
      </div>
    </div>
  `;
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "getbooked-live" } },
  });
}

function normalizeRole(input: unknown): Role | null {
  const parsed = roleSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

function createNotification(userKey: string, title: string, body: string, actionUrl: string) {
  const items = inMemoryNotifications.get(userKey) ?? [];
  items.unshift({
    id: `${userKey}-${Date.now()}`,
    title,
    body,
    actionUrl,
    createdAt: new Date().toISOString(),
  });
  inMemoryNotifications.set(userKey, items.slice(0, 10));
}

async function trySyncUserProfile(user: { openId: string; email?: string | null; name?: string | null }) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const fallback = inMemoryProfiles.get(user.openId) ?? {
    role: null,
    onboardingComplete: false,
    profileCompletion: 32,
  };

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        open_id: user.openId,
        email: user.email ?? null,
        display_name: user.name ?? "GetBooked member",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "open_id" },
    )
    .select("id, open_id, role, onboarding_complete, profile_completion, display_name, email")
    .single();

  if (error) {
    return null;
  }

  return {
    role: normalizeRole(data.role),
    onboardingComplete: Boolean(data.onboarding_complete),
    profileCompletion: Number(data.profile_completion ?? fallback.profileCompletion ?? 32),
    displayName: data.display_name ?? user.name ?? "GetBooked member",
    email: data.email ?? user.email ?? null,
  };
}

export async function getViewerState(user: {
  id: number;
  openId: string;
  email?: string | null;
  name?: string | null;
}) {
  const synced = await trySyncUserProfile(user);
  const inMemory = inMemoryProfiles.get(user.openId) ?? {
    role: null,
    onboardingComplete: false,
    profileCompletion: 32,
  };
  const role = synced?.role ?? inMemory.role ?? null;

  return {
    user: {
      id: user.id,
      openId: user.openId,
      name: synced?.displayName ?? user.name ?? "GetBooked member",
      email: synced?.email ?? user.email ?? null,
    },
    role,
    onboardingComplete: synced?.onboardingComplete ?? inMemory.onboardingComplete,
    profileCompletion: synced?.profileCompletion ?? inMemory.profileCompletion,
    availableRoles: ROLE_ORDER,
  };
}

export async function setViewerRole(
  user: { openId: string; email?: string | null; name?: string | null },
  role: Role,
) {
  const supabase = getSupabase();
  const profileCompletion = role === "artist" ? 68 : 54;

  inMemoryProfiles.set(user.openId, {
    role,
    onboardingComplete: true,
    profileCompletion,
  });

  if (supabase) {
    const { error } = await supabase.from("user_profiles").upsert(
      {
        open_id: user.openId,
        email: user.email ?? null,
        display_name: user.name ?? "GetBooked member",
        role,
        onboarding_complete: true,
        profile_completion: profileCompletion,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "open_id" },
    );

    if (error) {
      console.warn("[GetBooked] Failed to persist role to Supabase:", error.message);
    }
  }

  createNotification(
    user.openId,
    "Welcome to GetBooked.Live",
    `Your ${ROLE_CONFIG[role].label.toLowerCase()} workspace is ready.`,
    `/app/${role}`,
  );

  return { role, redirectTo: `/app/${role}` };
}

function matchesSearch(profile: ProfileCard, search?: string) {
  if (!search) return true;
  const haystack = `${profile.name} ${profile.city} ${profile.tagline} ${profile.primaryMeta}`.toLowerCase();
  return haystack.includes(search.toLowerCase());
}

function matchesFilters(profile: ProfileCard, input: z.infer<typeof browseInputSchema>) {
  if (input.role !== "all" && profile.role !== input.role) return false;
  if (input.city && profile.city.toLowerCase() !== input.city.toLowerCase()) return false;
  if (input.genre && `${profile.filters.genre ?? ""}`.toLowerCase() !== input.genre.toLowerCase()) return false;
  if (input.venueType && `${profile.filters.venueType ?? ""}`.toLowerCase() !== input.venueType.toLowerCase()) return false;
  if (input.skill && `${profile.filters.skill ?? ""}`.toLowerCase() !== input.skill.toLowerCase()) return false;
  if (input.creativeType && `${profile.filters.type ?? ""}`.toLowerCase() !== input.creativeType.toLowerCase()) return false;
  if (typeof input.minScore === "number" && (profile.score ?? 0) < input.minScore) return false;
  if (typeof input.priceMax === "number") {
    const values = [profile.filters.feeMax, profile.filters.rateMax, profile.filters.feeMin, profile.filters.rateMin]
      .filter((value): value is number => typeof value === "number");
    if (values.length > 0 && Math.min(...values) > input.priceMax) return false;
  }
  return matchesSearch(profile, input.search);
}

async function browseFromSupabase(input: z.infer<typeof browseInputSchema>) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const sources: Array<{ role: Role; table: string }> = [
    { role: "artist", table: "artist_profiles" },
    { role: "promoter", table: "user_profiles" },
    { role: "venue", table: "venue_profiles" },
    { role: "crew", table: "crew_profiles" },
    { role: "creative", table: "creative_profiles" },
  ];

  const activeSources = input.role === "all" ? sources : sources.filter(item => item.role === input.role);
  const results: ProfileCard[] = [];

  for (const source of activeSources) {
    let query = supabase.from(source.table).select("*").limit(12);

    if (input.city && source.role !== "promoter") query = query.eq("city", input.city);
    if (source.role === "promoter") query = query.eq("role", "promoter");
    if (source.role === "artist" && input.genre) query = query.eq("genre", input.genre);
    if (source.role === "venue" && input.venueType) query = query.eq("venue_type", input.venueType);
    if (source.role === "crew" && input.skill) query = query.eq("primary_skill", input.skill);
    if (source.role === "creative" && input.creativeType) query = query.eq("creative_type", input.creativeType);
    if (typeof input.minScore === "number" && source.role === "artist") query = query.gte("bookscore", input.minScore);

    const { data, error } = await query;
    if (error) return null;

    for (const row of data ?? []) {
      results.push({
        id: `${source.role}-${row.id}`,
        role: source.role,
        name: row.name ?? row.display_name ?? "GetBooked profile",
        slug: row.slug ?? `${source.role}-${row.id}`,
        city: row.city ?? "Unknown",
        country: row.country ?? "",
        tagline: row.bio ?? row.tagline ?? ROLE_CONFIG[source.role].description,
        primaryMeta:
          source.role === "artist"
            ? row.genre ?? "Artist"
            : source.role === "promoter"
              ? row.company_name ?? row.team_name ?? "Promoter"
              : source.role === "venue"
                ? `${row.venue_type ?? "Venue"} · Capacity ${row.capacity ?? "—"}`
                : source.role === "crew"
                  ? row.primary_skill ?? "Crew"
                  : row.creative_type ?? "Creative",
        secondaryMeta:
          source.role === "artist"
            ? `BookScore ${row.bookscore ?? 0}`
            : source.role === "promoter"
              ? row.city ?? row.secondary_meta ?? ROLE_CONFIG[source.role].label
              : row.secondary_meta ?? ROLE_CONFIG[source.role].label,
        priceLabel:
          source.role === "promoter"
            ? row.price_label ?? row.market_label ?? "Open to new bookings"
            : row.price_label ??
              row.rate_label ??
              row.fee_label ??
              `${row.fee_min ?? row.rate_min ?? "—"}–${row.fee_max ?? row.rate_max ?? "—"}`,
        accent: ROLE_CONFIG[source.role].accent,
        score: typeof row.bookscore === "number" ? row.bookscore : undefined,
        imageUrl: row.hero_image_url ?? row.portfolio_cover_url ?? "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
        filters: {
          genre: row.genre,
          city: row.city,
          feeMin: row.fee_min,
          feeMax: row.fee_max,
          rateMin: row.rate_min,
          rateMax: row.rate_max,
          venueType: row.venue_type,
          skill: row.primary_skill,
          type: row.creative_type,
          capacity: row.capacity,
        },
      });
    }
  }

  return results.filter(profile => matchesFilters(profile, input));
}

export async function listBrowseProfiles(rawInput: unknown) {
  const input = browseInputSchema.parse(rawInput ?? {});
  const supabaseProfiles = await browseFromSupabase(input);
  const profiles = (supabaseProfiles ?? BROWSE_PROFILES).filter(profile => matchesFilters(profile, input));

  return {
    role: input.role,
    profiles,
    availableCities: Array.from(new Set(profiles.map(profile => profile.city))),
    availableGenres: Array.from(new Set(BROWSE_PROFILES.map(profile => `${profile.filters.genre ?? ""}`).filter(Boolean))),
    availableVenueTypes: Array.from(new Set(BROWSE_PROFILES.map(profile => `${profile.filters.venueType ?? ""}`).filter(Boolean))),
    availableSkills: Array.from(new Set(BROWSE_PROFILES.map(profile => `${profile.filters.skill ?? ""}`).filter(Boolean))),
    availableCreativeTypes: Array.from(new Set(BROWSE_PROFILES.map(profile => `${profile.filters.type ?? ""}`).filter(Boolean))),
  };
}

export function getDashboard(role: Role) {
  const seed = DASHBOARD_SEEDS[role];
  return {
    role,
    roleLabel: ROLE_CONFIG[role].label,
    accent: ROLE_CONFIG[role].accent,
    title: ROLE_CONFIG[role].dashboardTitle,
    metrics: seed.metrics,
    inboxLabel: ROLE_CONFIG[role].inboxLabel,
    inbox: seed.inbox,
    quickLinks: seed.quickLinks,
  };
}

export function listOffers(role: Role) {
  return Array.from(inMemoryOffers.values()).filter(
    offer => role === "promoter" || offer.roleContext === role || offer.status === "accepted",
  );
}

export function getOffer(id: string) {
  return inMemoryOffers.get(id) ?? OFFER_SEEDS.find(offer => offer.id === id) ?? null;
}

export async function createOffer(user: { openId: string; email?: string | null; name?: string | null }, payload: {
  artistName: string;
  eventName: string;
  eventDate: string;
  venueName: string;
  city: string;
  feeLabel: string;
  depositLabel: string;
  dealType: string;
}) {
  const id = `offer-${Date.now()}`;
  const artistContact = await resolveContactByRoleAndName("artist", payload.artistName);
  const promoterName = user.name ?? "You";
  const offer: OfferRecord = {
    id,
    artistName: payload.artistName,
    artistEmail: artistContact?.email ?? null,
    artistOpenId: artistContact?.openId ?? null,
    promoterName,
    promoterEmail: user.email ?? null,
    promoterOpenId: user.openId,
    eventName: payload.eventName,
    eventDate: payload.eventDate,
    venueName: payload.venueName,
    city: payload.city,
    status: "sent",
    feeLabel: payload.feeLabel,
    depositLabel: payload.depositLabel,
    dealType: payload.dealType,
    roleContext: "promoter",
    activity: [
      {
        id: `${id}-activity-1`,
        title: "Offer sent",
        subtitle: `${payload.artistName} received a new structured offer.`,
        status: "Sent",
        dateLabel: "Just now",
      },
    ],
  };

  inMemoryOffers.set(id, offer);
  createNotification(user.openId, "Offer sent", `Your offer to ${payload.artistName} is now live.`, `/offers/${id}`);

  const artistNotificationKey = artistContact?.openId ?? `artist:${payload.artistName.toLowerCase()}`;
  createNotification(artistNotificationKey, "New offer received", `${payload.eventName} is waiting for review.`, `/offers/${id}`);

  if (artistContact?.email) {
    await sendTransactionalEmail({
      to: artistContact.email,
      subject: `New offer: ${payload.eventName}`,
      html: createOfferEmailHtml({
        heading: "You received a new offer",
        intro: `${promoterName} sent you a structured offer in GetBooked.Live. Review the terms and respond from your offer workspace.`,
        eventName: payload.eventName,
        eventDate: payload.eventDate,
        venueName: payload.venueName,
        city: payload.city,
        feeLabel: payload.feeLabel,
        depositLabel: payload.depositLabel,
        actionUrl: `/offers/${id}`,
      }),
      text: `${promoterName} sent you a new offer for ${payload.eventName} on ${payload.eventDate} at ${payload.venueName} in ${payload.city}. Fee: ${payload.feeLabel}. Deposit: ${payload.depositLabel}. Open /offers/${id} in GetBooked.Live to respond.`,
    });
  } else {
    await notifyOwner({
      title: "GetBooked artist email missing",
      content: `No artist email could be resolved for ${payload.artistName} on offer ${id}.`,
    });
  }

  return offer;
}

export async function respondToOffer(user: { openId: string; email?: string | null; name?: string | null }, id: string, status: Extract<OfferStatus, "accepted" | "countered" | "declined">) {
  const existing = getOffer(id);
  if (!existing) return null;

  const updated: OfferRecord = {
    ...existing,
    status,
    activity: [
      {
        id: `${id}-${status}-${Date.now()}`,
        title: `Offer ${status}`,
        subtitle: `The recipient marked this offer as ${status}.`,
        status: status.charAt(0).toUpperCase() + status.slice(1),
        dateLabel: "Just now",
      },
      ...existing.activity,
    ],
  };

  inMemoryOffers.set(id, updated);
  createNotification(user.openId, `Offer ${status}`, `You updated ${existing.eventName}.`, `/offers/${id}`);

  const promoterNotificationKey = existing.promoterOpenId ?? `promoter:${existing.promoterName.toLowerCase()}`;
  createNotification(promoterNotificationKey, `Offer ${status}`, `${existing.artistName} ${status} your offer.`, `/offers/${id}`);

  const promoterEmail = existing.promoterEmail ?? (await resolveContactByRoleAndName("promoter", existing.promoterName))?.email;
  if (promoterEmail) {
    await sendTransactionalEmail({
      to: promoterEmail,
      subject: `Offer ${status}: ${existing.eventName}`,
      html: createOfferEmailHtml({
        heading: `Offer ${status}`,
        intro: `${existing.artistName} ${status} the offer for ${existing.eventName}. Open GetBooked.Live to continue the booking flow.`,
        eventName: existing.eventName,
        eventDate: existing.eventDate,
        venueName: existing.venueName,
        city: existing.city,
        feeLabel: existing.feeLabel,
        depositLabel: existing.depositLabel,
        actionUrl: `/offers/${id}`,
      }),
      text: `${existing.artistName} ${status} the offer for ${existing.eventName} on ${existing.eventDate} at ${existing.venueName} in ${existing.city}. Open /offers/${id} in GetBooked.Live to continue.`,
    });
  } else {
    await notifyOwner({
      title: "GetBooked promoter email missing",
      content: `No promoter email could be resolved for ${existing.promoterName} on offer ${id}.`,
    });
  }

  return updated;
}

export function getDeal(id: string) {
  if (id === DEAL_SEED.id) return DEAL_SEED;
  const offers = Array.from(inMemoryOffers.values());
  const acceptedOffer = offers.find(offer => offer.id === id) ?? offers.find(offer => offer.status === "accepted");
  if (!acceptedOffer) return DEAL_SEED;

  return {
    ...DEAL_SEED,
    id,
    title: `${acceptedOffer.eventName} · ${acceptedOffer.artistName}`,
    eventDate: acceptedOffer.eventDate,
    venue: acceptedOffer.venueName,
    city: acceptedOffer.city,
    paymentMilestones: [
      { label: "Deposit", value: acceptedOffer.depositLabel, status: "Due now" },
      { label: "Performance fee", value: acceptedOffer.feeLabel, status: "Due on show day" },
      { label: "Platform fee", value: "Calculated at checkout", status: "Pending" },
    ],
  };
}

export function listNotifications(user: { openId: string }) {
  return inMemoryNotifications.get(user.openId) ?? [
    {
      id: `${user.openId}-welcome`,
      title: "Workspace ready",
      body: "Complete your profile to unlock the strongest first impression in browse and offers.",
      actionUrl: "/app",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function recordWaitlistEntry(input: { name: string; email: string; roleInterest: string; notes?: string }) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("waitlist_entries").insert({
      name: input.name,
      email: input.email,
      role_interest: input.roleInterest,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
    });
    if (!error) {
      return { success: true };
    }
  }

  await notifyOwner({
    title: "New GetBooked waitlist signup",
    content: `${input.name} (${input.email}) joined the waitlist as ${input.roleInterest}.`,
  });

  return { success: true };
}

export function computeBookScoreSnapshot() {
  return BROWSE_PROFILES.filter(profile => profile.role === "artist").map(profile => ({
    artistSlug: profile.slug,
    bookingCompletionScore: Math.min(100, Math.round((profile.score ?? 84) * 0.42)),
    responseRateScore: Math.min(100, Math.round((profile.score ?? 84) * 0.31)),
    reviewScore: Math.min(100, Math.round((profile.score ?? 84) * 0.27)),
    total: profile.score ?? 84,
  }));
}

export async function refreshBookScores() {
  const snapshot = computeBookScoreSnapshot();
  const supabase = getSupabase();

  if (supabase) {
    for (const entry of snapshot) {
      await supabase.from("bookscore_snapshots").insert({
        artist_slug: entry.artistSlug,
        booking_completion_score: entry.bookingCompletionScore,
        response_rate_score: entry.responseRateScore,
        review_score: entry.reviewScore,
        bookscore_total: entry.total,
        calculated_at: new Date().toISOString(),
      });

      await supabase
        .from("artist_profiles")
        .update({ bookscore: entry.total, updated_at: new Date().toISOString() })
        .eq("slug", entry.artistSlug);
    }
  }

  return {
    refreshedAt: new Date().toISOString(),
    updatedArtists: snapshot.length,
    snapshot,
  };
}

export { browseInputSchema, roleSchema };
