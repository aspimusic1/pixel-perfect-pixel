export type Role = "artist" | "promoter" | "venue" | "crew" | "creative";

export type BrowseRole = "all" | Role;

export type OfferStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "countered"
  | "accepted"
  | "declined"
  | "expired";

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  dateLabel: string;
};

export type ProfileCard = {
  id: string;
  role: Role;
  name: string;
  slug: string;
  city: string;
  country: string;
  tagline: string;
  primaryMeta: string;
  secondaryMeta: string;
  priceLabel: string;
  accent: string;
  score?: number;
  imageUrl: string;
  filters: Record<string, string | number>;
};

export type OfferRecord = {
  id: string;
  artistName: string;
  artistEmail?: string | null;
  artistOpenId?: string | null;
  promoterName: string;
  promoterEmail?: string | null;
  promoterOpenId?: string | null;
  eventName: string;
  eventDate: string;
  venueName: string;
  city: string;
  status: OfferStatus;
  feeLabel: string;
  depositLabel: string;
  dealType: string;
  roleContext: Role;
  activity: ActivityItem[];
};

export type DealRecord = {
  id: string;
  title: string;
  status: string;
  contractStatus: string;
  paymentStatus: string;
  eventDate: string;
  venue: string;
  city: string;
  participants: Array<{ name: string; role: Role }>;
  contractChecklist: string[];
  paymentMilestones: Array<{ label: string; value: string; status: string }>;
  messages: Array<{ id: string; sender: string; sentAt: string; body: string }>;
};

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    accent: string;
    accentSoft: string;
    description: string;
    hero: string;
    cta: string;
    dashboardTitle: string;
    inboxLabel: string;
  }
> = {
  artist: {
    label: "Artist",
    accent: "#C8FF3E",
    accentSoft: "rgba(200,255,62,0.14)",
    description: "Showcase your profile, receive serious offers, and turn negotiations into confirmed bookings.",
    hero: "Book more shows with structured offers, reliable payments, and a reputation system built for artists.",
    cta: "Join as an artist",
    dashboardTitle: "Artist dashboard",
    inboxLabel: "Offer inbox",
  },
  promoter: {
    label: "Promoter",
    accent: "#FF5C8A",
    accentSoft: "rgba(255,92,138,0.14)",
    description: "Discover verified talent, send structured offers, and manage every booking in one place.",
    hero: "Run your booking pipeline with faster outreach, clearer terms, and one central deal room.",
    cta: "Join as a promoter",
    dashboardTitle: "Promoter dashboard",
    inboxLabel: "Recent offer activity",
  },
  venue: {
    label: "Venue",
    accent: "#FFB83E",
    accentSoft: "rgba(255,184,62,0.14)",
    description: "Fill open dates, review structured requests, and stay in control of your terms.",
    hero: "Turn venue availability into confirmed bookings with transparent requests and organized contracts.",
    cta: "List your venue",
    dashboardTitle: "Venue dashboard",
    inboxLabel: "Inbound requests",
  },
  crew: {
    label: "Crew",
    accent: "#7B5CF0",
    accentSoft: "rgba(123,92,240,0.14)",
    description: "Make your technical skills visible and get staffed on shows that need your expertise.",
    hero: "Show your skills, set your availability, and get booked for productions that fit your craft.",
    cta: "Create crew profile",
    dashboardTitle: "Crew dashboard",
    inboxLabel: "Gig offers",
  },
  creative: {
    label: "Creative",
    accent: "#3EC8FF",
    accentSoft: "rgba(62,200,255,0.14)",
    description: "Win more photography and video work by making your portfolio discoverable to the right teams.",
    hero: "Turn your portfolio into bookable opportunities with clear briefs and streamlined deal management.",
    cta: "Join as a creative",
    dashboardTitle: "Creative dashboard",
    inboxLabel: "Inquiry inbox",
  },
};

export const ROLE_ORDER: Role[] = ["artist", "promoter", "venue", "crew", "creative"];

export const FEATURE_HIGHLIGHTS = [
  {
    title: "Structured offers",
    description: "Collect venue, fee, logistics, and deposit terms in one offer flow instead of fragmented messages.",
  },
  {
    title: "Central deal rooms",
    description: "Move accepted work into a shared record for contracts, messages, and payment milestones.",
  },
  {
    title: "BookScore reputation",
    description: "Help promoters discover reliable artists using response history, booking performance, and reviews.",
  },
  {
    title: "Role-built dashboards",
    description: "Give each role a clear command center with metrics, inboxes, and quick actions aligned to their workflow.",
  },
];

export const BROWSE_PROFILES: ProfileCard[] = [
  {
    id: "artist-midnight-sonar",
    role: "artist",
    name: "Midnight Sonar",
    slug: "midnight-sonar",
    city: "Los Angeles",
    country: "USA",
    tagline: "Indie electronic trio with cinematic live visuals.",
    primaryMeta: "Indie Electronic",
    secondaryMeta: "BookScore 92",
    priceLabel: "$4.5k–$6k",
    accent: ROLE_CONFIG.artist.accent,
    score: 92,
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80",
    filters: { genre: "indie electronic", city: "Los Angeles", feeMin: 4500, feeMax: 6000 },
  },
  {
    id: "artist-neon-harbor",
    role: "artist",
    name: "Neon Harbor",
    slug: "neon-harbor",
    city: "New York",
    country: "USA",
    tagline: "Alt-pop headliner known for sold-out coastal tours.",
    primaryMeta: "Alt Pop",
    secondaryMeta: "BookScore 88",
    priceLabel: "$8k–$12k",
    accent: ROLE_CONFIG.artist.accent,
    score: 88,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    filters: { genre: "alt pop", city: "New York", feeMin: 8000, feeMax: 12000 },
  },
  {
    id: "venue-echo-room",
    role: "venue",
    name: "The Echo Room",
    slug: "the-echo-room",
    city: "Chicago",
    country: "USA",
    tagline: "Modern 600-cap room with premium FOH package.",
    primaryMeta: "Club · Capacity 600",
    secondaryMeta: "Friday dates open",
    priceLabel: "$1.8k–$2.6k",
    accent: ROLE_CONFIG.venue.accent,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Chicago", capacity: 600, venueType: "club", rateMin: 1800, rateMax: 2600 },
  },
  {
    id: "venue-lantern-hall",
    role: "venue",
    name: "Lantern Hall",
    slug: "lantern-hall",
    city: "Nashville",
    country: "USA",
    tagline: "Historic theater built for seated showcases and livestreams.",
    primaryMeta: "Theater · Capacity 950",
    secondaryMeta: "Premium backstage amenities",
    priceLabel: "$3.2k–$4.4k",
    accent: ROLE_CONFIG.venue.accent,
    imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Nashville", capacity: 950, venueType: "theater", rateMin: 3200, rateMax: 4400 },
  },
  {
    id: "crew-signal-chain",
    role: "crew",
    name: "Signal Chain Touring",
    slug: "signal-chain-touring",
    city: "Austin",
    country: "USA",
    tagline: "Touring audio team covering FOH, monitors, and playback.",
    primaryMeta: "Sound",
    secondaryMeta: "Festival and club-ready",
    priceLabel: "$650/day",
    accent: ROLE_CONFIG.crew.accent,
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Austin", skill: "sound", rateMin: 650, rateMax: 650 },
  },
  {
    id: "crew-lightgrid",
    role: "crew",
    name: "LightGrid Ops",
    slug: "lightgrid-ops",
    city: "Atlanta",
    country: "USA",
    tagline: "Lighting programmers and operators for high-impact rooms.",
    primaryMeta: "Lights",
    secondaryMeta: "Timecoded show support",
    priceLabel: "$720/day",
    accent: ROLE_CONFIG.crew.accent,
    imageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Atlanta", skill: "lights", rateMin: 720, rateMax: 720 },
  },
  {
    id: "creative-frame-society",
    role: "creative",
    name: "Frame Society",
    slug: "frame-society",
    city: "Brooklyn",
    country: "USA",
    tagline: "Concert photo and backstage editorial team.",
    primaryMeta: "Photographer",
    secondaryMeta: "Editorial + live captures",
    priceLabel: "$1.2k/project",
    accent: ROLE_CONFIG.creative.accent,
    imageUrl: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Brooklyn", type: "photographer", rateMin: 1200, rateMax: 1200 },
  },
  {
    id: "creative-reel-motion",
    role: "creative",
    name: "Reel Motion Studio",
    slug: "reel-motion-studio",
    city: "Miami",
    country: "USA",
    tagline: "Tour recap films and high-speed social edits.",
    primaryMeta: "Videographer",
    secondaryMeta: "Vertical content packages",
    priceLabel: "$2.4k/project",
    accent: ROLE_CONFIG.creative.accent,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    filters: { city: "Miami", type: "videographer", rateMin: 2400, rateMax: 2400 },
  },
];

export const DASHBOARD_SEEDS: Record<
  Role,
  {
    metrics: DashboardMetric[];
    inbox: ActivityItem[];
    quickLinks: Array<{ label: string; href: string }>;
  }
> = {
  artist: {
    metrics: [
      { label: "Offers received", value: "18", change: "+4 this month" },
      { label: "Bookings completed", value: "42", change: "+6 this quarter" },
      { label: "Total earned", value: "$86.4k", change: "+12% YoY" },
      { label: "BookScore", value: "92", change: "+3 since last refresh" },
    ],
    inbox: [
      { id: "ai-1", title: "Neon Nights Festival", subtitle: "Offer received from Northstar Presents", status: "Sent", dateLabel: "Today" },
      { id: "ai-2", title: "Counter received", subtitle: "The Metro Room updated hospitality terms", status: "Countered", dateLabel: "Yesterday" },
      { id: "ai-3", title: "Deposit confirmed", subtitle: "Harbor Sessions paid the deposit milestone", status: "Paid", dateLabel: "2 days ago" },
    ],
    quickLinks: [
      { label: "Browse promoters", href: "/browse" },
      { label: "Open offers", href: "/offers" },
      { label: "Upcoming deal room", href: "/deals/demo-deal" },
    ],
  },
  promoter: {
    metrics: [
      { label: "Offers sent", value: "31", change: "+9 this month" },
      { label: "Bookings confirmed", value: "14", change: "+3 this month" },
      { label: "Total spent", value: "$132k", change: "Pipeline healthy" },
      { label: "Active deals", value: "7", change: "2 awaiting response" },
    ],
    inbox: [
      { id: "pi-1", title: "Offer accepted", subtitle: "Midnight Sonar accepted Neon Nights Festival", status: "Accepted", dateLabel: "1 hour ago" },
      { id: "pi-2", title: "Counter received", subtitle: "Neon Harbor countered the guarantee", status: "Countered", dateLabel: "Today" },
      { id: "pi-3", title: "Venue option open", subtitle: "Lantern Hall opened a Friday date", status: "New", dateLabel: "Yesterday" },
    ],
    quickLinks: [
      { label: "Create new offer", href: "/offers/new" },
      { label: "Browse artists", href: "/browse/artists" },
      { label: "Review active deals", href: "/deals/demo-deal" },
    ],
  },
  venue: {
    metrics: [
      { label: "Booking requests", value: "22", change: "+5 this month" },
      { label: "Dates filled", value: "11", change: "73% occupancy" },
      { label: "Revenue", value: "$47.2k", change: "+18% vs last month" },
      { label: "Open dates", value: "8", change: "Friday focus" },
    ],
    inbox: [
      { id: "vi-1", title: "Inbound request", subtitle: "Northstar Presents requested July 19", status: "Review", dateLabel: "Today" },
      { id: "vi-2", title: "Contract ready", subtitle: "Summer House Series contract generated", status: "Ready", dateLabel: "Yesterday" },
      { id: "vi-3", title: "Deposit received", subtitle: "Harbor Sessions deposit collected", status: "Paid", dateLabel: "3 days ago" },
    ],
    quickLinks: [
      { label: "Open browse", href: "/browse/venues" },
      { label: "Review offers", href: "/offers" },
      { label: "Upcoming deal room", href: "/deals/demo-deal" },
    ],
  },
  crew: {
    metrics: [
      { label: "Gig offers", value: "12", change: "+4 this month" },
      { label: "Gigs completed", value: "54", change: "Touring steadily" },
      { label: "Total earned", value: "$61.8k", change: "+9% this quarter" },
      { label: "Availability set", value: "86%", change: "Next 60 days" },
    ],
    inbox: [
      { id: "ci-1", title: "Tour staffing request", subtitle: "Need FOH + playback for 6 dates", status: "Open", dateLabel: "Today" },
      { id: "ci-2", title: "Call time updated", subtitle: "Signal Chain rehearsal advanced to 2 PM", status: "Updated", dateLabel: "Yesterday" },
      { id: "ci-3", title: "Payment milestone", subtitle: "Weekend support invoice marked ready", status: "Ready", dateLabel: "2 days ago" },
    ],
    quickLinks: [
      { label: "Browse crew gigs", href: "/browse/crews" },
      { label: "View offers", href: "/offers" },
      { label: "Active deal", href: "/deals/demo-deal" },
    ],
  },
  creative: {
    metrics: [
      { label: "Inquiries", value: "16", change: "+5 this month" },
      { label: "Shoots completed", value: "28", change: "+2 this month" },
      { label: "Total earned", value: "$48.9k", change: "+14% YoY" },
      { label: "Portfolio views", value: "1.4k", change: "+18% this month" },
    ],
    inbox: [
      { id: "cr-1", title: "Tour recap request", subtitle: "Need vertical social cutdowns for 3 shows", status: "Open", dateLabel: "Today" },
      { id: "cr-2", title: "Brief updated", subtitle: "Artist requested more backstage content", status: "Updated", dateLabel: "Yesterday" },
      { id: "cr-3", title: "Final delivery approved", subtitle: "Miami Weekender recap signed off", status: "Approved", dateLabel: "3 days ago" },
    ],
    quickLinks: [
      { label: "Browse creatives", href: "/browse/creatives" },
      { label: "Open inquiries", href: "/offers" },
      { label: "Current deal", href: "/deals/demo-deal" },
    ],
  },
};

export const OFFER_SEEDS: OfferRecord[] = [
  {
    id: "offer-neon-nights",
    artistName: "Midnight Sonar",
    promoterName: "Northstar Presents",
    eventName: "Neon Nights Festival",
    eventDate: "2026-07-19",
    venueName: "Lantern Hall",
    city: "Nashville",
    status: "sent",
    feeLabel: "$6,000 guarantee",
    depositLabel: "$1,500 deposit",
    dealType: "Flat fee",
    roleContext: "artist",
    activity: [
      { id: "oa-1", title: "Offer sent", subtitle: "Northstar Presents submitted the offer", status: "Sent", dateLabel: "Today" },
      { id: "oa-2", title: "Viewed", subtitle: "Artist opened the full terms", status: "Viewed", dateLabel: "Today" },
    ],
  },
  {
    id: "offer-harbor-sessions",
    artistName: "Neon Harbor",
    promoterName: "Harbor Sessions",
    eventName: "Harbor Sessions Rooftop",
    eventDate: "2026-08-04",
    venueName: "The Echo Room",
    city: "Chicago",
    status: "countered",
    feeLabel: "$8,500 guarantee",
    depositLabel: "$2,000 deposit",
    dealType: "Hybrid",
    roleContext: "promoter",
    activity: [
      { id: "ob-1", title: "Offer sent", subtitle: "Original offer delivered to artist", status: "Sent", dateLabel: "Yesterday" },
      { id: "ob-2", title: "Counter received", subtitle: "Artist requested revised hospitality and fee", status: "Countered", dateLabel: "Today" },
    ],
  },
  {
    id: "offer-tour-support",
    artistName: "Midnight Sonar",
    promoterName: "Northstar Presents",
    eventName: "Autumn Tour Support",
    eventDate: "2026-09-02",
    venueName: "Regional Tour",
    city: "Austin",
    status: "accepted",
    feeLabel: "$650 per day",
    depositLabel: "$0 deposit",
    dealType: "Crew day rate",
    roleContext: "crew",
    activity: [
      { id: "oc-1", title: "Offer sent", subtitle: "Crew package proposed for six dates", status: "Sent", dateLabel: "3 days ago" },
      { id: "oc-2", title: "Accepted", subtitle: "Signal Chain Touring accepted the scope", status: "Accepted", dateLabel: "Today" },
    ],
  },
];

export const DEAL_SEED: DealRecord = {
  id: "demo-deal",
  title: "Neon Nights Festival · Midnight Sonar",
  status: "Active",
  contractStatus: "Ready for signature",
  paymentStatus: "Deposit due",
  eventDate: "2026-07-19",
  venue: "Lantern Hall",
  city: "Nashville",
  participants: [
    { name: "Midnight Sonar", role: "artist" },
    { name: "Northstar Presents", role: "promoter" },
    { name: "Lantern Hall", role: "venue" },
  ],
  contractChecklist: [
    "Performance agreement reviewed",
    "Hospitality rider approved",
    "Set times confirmed",
    "Insurance certificate requested",
  ],
  paymentMilestones: [
    { label: "Deposit", value: "$1,500", status: "Due now" },
    { label: "Final payment", value: "$4,500", status: "Due on show day" },
    { label: "Platform fee", value: "$600", status: "Calculated" },
  ],
  messages: [
    {
      id: "msg-1",
      sender: "Northstar Presents",
      sentAt: "Today · 10:12 AM",
      body: "We have locked the venue hold and attached the revised hospitality rider. Please confirm the backstage guest list when ready.",
    },
    {
      id: "msg-2",
      sender: "Midnight Sonar",
      sentAt: "Today · 11:08 AM",
      body: "Confirmed. We are good on the rider and will send the final guest list this afternoon.",
    },
  ],
};

export const WAITLIST_OPTIONS = [
  "Artist",
  "Promoter",
  "Venue",
  "Crew",
  "Creative",
];
