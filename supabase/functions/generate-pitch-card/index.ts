import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    // Fetch profile
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch recent bookings
    const { data: bookings } = await adminClient
      .from("bookings")
      .select("venue_name, event_date, guarantee, status")
      .eq("artist_id", userId)
      .order("event_date", { ascending: false })
      .limit(10);

    const stats = profile.streaming_stats || {};

    // Generate PDF
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    let y = 50;

    // Header
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(profile.display_name || "Artist", 50, y);
    y += 30;

    // Subtitle
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    const subtitle = [profile.genre, profile.city && profile.state ? `${profile.city}, ${profile.state}` : null].filter(Boolean).join(" · ");
    if (subtitle) { doc.text(subtitle, 50, y); y += 25; }

    // Divider
    doc.setDrawColor(220);
    doc.line(50, y, W - 50, y);
    y += 20;

    // Stats row
    doc.setTextColor(60);
    doc.setFontSize(10);
    const statsLine = [];
    if (stats.followers) statsLine.push(`${stats.followers.toLocaleString()} Spotify followers`);
    if (stats.popularity) statsLine.push(`Popularity: ${stats.popularity}/100`);
    if (profile.rate_min || profile.rate_max) {
      statsLine.push(`Fee: $${(profile.rate_min || 0).toLocaleString()} – $${(profile.rate_max || 0).toLocaleString()}`);
    }
    if (statsLine.length) { doc.text(statsLine.join("  ·  "), 50, y); y += 20; }

    // Top tracks
    if (stats.top_tracks?.length) {
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text("Top Tracks", 50, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      stats.top_tracks.slice(0, 5).forEach((t: any, i: number) => {
        doc.text(`${i + 1}. ${t.name} (${t.album})`, 60, y);
        y += 15;
      });
    }

    // Bio
    if (profile.bio) {
      y += 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text("About", 50, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      const lines = doc.splitTextToSize(profile.bio, W - 100);
      doc.text(lines, 50, y);
      y += lines.length * 14;
    }

    // Past shows
    if (bookings?.length) {
      y += 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text("Recent Shows", 50, y);
      y += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80);
      bookings.forEach((b: any) => {
        if (y > 700) { doc.addPage(); y = 50; }
        doc.text(`${b.venue_name} — ${new Date(b.event_date).toLocaleDateString()} — $${b.guarantee.toLocaleString()}`, 60, y);
        y += 15;
      });
    }

    // Footer CTA
    y = Math.max(y + 30, 680);
    doc.setDrawColor(220);
    doc.line(50, y, W - 50, y);
    y += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Book via GetBooked.Live", 50, y);
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    const profileUrl = `https://getbookedlive.lovable.app/p/${profile.slug || profile.user_id}`;
    doc.text(profileUrl, 50, y);

    // Convert to buffer and upload
    const pdfBuffer = doc.output("arraybuffer");
    const fileName = `${userId}/pitch-card.pdf`;

    await adminClient.storage.from("contracts").upload(fileName, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

    const { data: urlData } = adminClient.storage.from("contracts").getPublicUrl(fileName);
    const pdfUrl = urlData.publicUrl + `?t=${Date.now()}`;

    // Save URL to profile
    await adminClient
      .from("profiles")
      .update({ pitch_card_url: pdfUrl })
      .eq("user_id", userId);

    return new Response(JSON.stringify({ success: true, url: pdfUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-pitch-card error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
