import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claims } = await userClient.auth.getUser();
    if (!claims?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.user.id;

    // Fetch promoter's recent bookings
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("artist_id, venue_name, event_date, guarantee")
      .eq("promoter_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get artist profiles for those bookings
    const bookedArtistIds = (recentBookings ?? []).map((b) => b.artist_id);
    let bookedProfiles: any[] = [];
    if (bookedArtistIds.length > 0) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, genre, city, rate_min, rate_max")
        .in("user_id", bookedArtistIds);
      bookedProfiles = data ?? [];
    }

    // Fetch available artists not already booked
    const { data: availableArtists } = await supabase
      .from("profiles")
      .select("user_id, display_name, genre, city, state, rate_min, rate_max, avatar_url, slug")
      .eq("role", "artist")
      .eq("profile_complete", true)
      .not("user_id", "in", `(${bookedArtistIds.length > 0 ? bookedArtistIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
      .limit(50);

    const bookingHistory = bookedProfiles.map((p, i) => {
      const b = recentBookings?.[i];
      return `- ${p.display_name} (${p.genre || "unknown genre"}) in ${p.city || "?"} for $${b?.guarantee || "?"}`;
    }).join("\n");

    const candidates = (availableArtists ?? []).map((a) =>
      `ID:${a.user_id} | ${a.display_name} | ${a.genre || "?"} | ${a.city || "?"}, ${a.state || "?"} | $${a.rate_min || "?"}-$${a.rate_max || "?"}`
    ).join("\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You recommend artists to music promoters based on their booking history. Return ONLY valid JSON array." },
          { role: "user", content: `Promoter's recent bookings:\n${bookingHistory || "No recent bookings"}\n\nAvailable artists:\n${candidates || "None"}\n\nReturn JSON array of exactly 5 recommendations (or fewer if not enough candidates):\n[{"user_id": "...", "display_name": "...", "reason": "<1 sentence explanation referencing their booking history>", "match_score": <50-99>}]` },
        ],
      }),
    });

    let recommendations = [];
    if (aiRes.ok) {
      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content ?? "[]";
      try {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/```\s*([\s\S]*?)```/);
        recommendations = JSON.parse(jsonMatch ? jsonMatch[1].trim() : content.trim());
      } catch {
        recommendations = [];
      }
    }

    // Enrich with profile data
    const enriched = recommendations.map((rec: any) => {
      const profile = (availableArtists ?? []).find((a) => a.user_id === rec.user_id);
      return { ...rec, ...profile };
    }).filter((r: any) => r.display_name);

    return new Response(JSON.stringify({ recommendations: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("recommend-artists error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
