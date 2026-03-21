import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claims, error: claimsErr } = await userClient.auth.getUser();
    if (claimsErr || !claims?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { booking_id } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch booking + offer data
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*, offers(*)")
      .eq("id", booking_id)
      .single();

    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const offer = booking.offers;

    // Fetch artist + promoter profiles
    const [artistRes, promoterRes] = await Promise.all([
      supabase.from("profiles").select("display_name, city, state").eq("user_id", booking.artist_id).single(),
      supabase.from("profiles").select("display_name, city, state").eq("user_id", booking.promoter_id).single(),
    ]);

    const artistName = artistRes.data?.display_name ?? "Artist";
    const promoterName = promoterRes.data?.display_name ?? "Promoter";
    const artistLocation = [artistRes.data?.city, artistRes.data?.state].filter(Boolean).join(", ");

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();

    const dark = rgb(0.031, 0.047, 0.078); // #080C14
    const lime = rgb(0.784, 1, 0.243); // #C8FF3E
    const white = rgb(0.941, 0.949, 0.969); // #F0F2F7
    const gray = rgb(0.533, 0.573, 0.643); // #8892A4
    const lineColor = rgb(0.2, 0.22, 0.26);

    // Dark background
    page.drawRectangle({ x: 0, y: 0, width, height, color: dark });

    let y = height - 60;

    // Header
    page.drawText("GETBOOKED.LIVE", {
      x: 50, y, size: 10, font: helveticaBold, color: lime,
    });

    y -= 12;
    page.drawText("PERFORMANCE CONTRACT", {
      x: 50, y, size: 10, font: helvetica, color: gray,
    });

    y -= 40;
    page.drawText("Performance Agreement", {
      x: 50, y, size: 24, font: helveticaBold, color: white,
    });

    y -= 20;
    page.drawRectangle({ x: 50, y, width: width - 100, height: 1, color: lineColor });

    y -= 30;
    const contractDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    page.drawText(`Date: ${contractDate}`, {
      x: 50, y, size: 10, font: helvetica, color: gray,
    });
    page.drawText(`Contract #${booking.id.substring(0, 8).toUpperCase()}`, {
      x: width - 250, y, size: 10, font: helvetica, color: gray,
    });

    // Parties section
    y -= 40;
    page.drawText("PARTIES", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    y -= 22;
    page.drawText("Artist / Performer", { x: 50, y, size: 9, font: helvetica, color: gray });
    page.drawText("Promoter / Buyer", { x: 320, y, size: 9, font: helvetica, color: gray });

    y -= 16;
    page.drawText(artistName, { x: 50, y, size: 13, font: helveticaBold, color: white });
    page.drawText(promoterName, { x: 320, y, size: 13, font: helveticaBold, color: white });

    if (artistLocation) {
      y -= 14;
      page.drawText(artistLocation, { x: 50, y, size: 9, font: helvetica, color: gray });
    }

    // Event details section
    y -= 40;
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
    y -= 25;
    page.drawText("EVENT DETAILS", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    const eventDate = new Date(booking.event_date).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    const details = [
      ["Venue", booking.venue_name],
      ["Date", eventDate],
      ...(booking.event_time ? [["Time", booking.event_time]] : []),
    ];

    for (const [label, value] of details) {
      y -= 22;
      page.drawText(label, { x: 50, y, size: 9, font: helvetica, color: gray });
      page.drawText(String(value), { x: 180, y, size: 11, font: helveticaBold, color: white });
    }

    // Financial terms
    y -= 35;
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
    y -= 25;
    page.drawText("FINANCIAL TERMS", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    const guarantee = Number(offer?.guarantee ?? booking.guarantee);
    const commissionRate = Number(offer?.commission_rate ?? 0.1);
    const commission = Math.floor(guarantee * commissionRate);
    const artistPayout = guarantee - commission;

    const financials = [
      ["Guarantee", `$${guarantee.toLocaleString()}`],
      ...(offer?.door_split ? [["Door Split", `${offer.door_split}%`]] : []),
      ...(offer?.merch_split ? [["Merch Split", `${offer.merch_split}%`]] : []),
      ["Platform Fee", `${(commissionRate * 100).toFixed(0)}% ($${commission.toLocaleString()})`],
      ["Artist Net Payout", `$${artistPayout.toLocaleString()}`],
    ];

    for (const [label, value] of financials) {
      y -= 22;
      page.drawText(label, { x: 50, y, size: 9, font: helvetica, color: gray });
      const isNet = label === "Artist Net Payout";
      page.drawText(String(value), {
        x: 180, y, size: isNet ? 13 : 11,
        font: isNet ? helveticaBold : helveticaBold,
        color: isNet ? lime : white,
      });
    }

    // Deposit terms
    y -= 35;
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
    y -= 25;
    page.drawText("DEPOSIT & PAYMENT TERMS", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    const deposit = Math.round(guarantee * 0.5);
    const depositTerms = [
      `50% deposit ($${deposit.toLocaleString()}) due within 14 days of signing.`,
      `Remaining balance ($${(guarantee - deposit).toLocaleString()}) due on the day of the event.`,
      `All payments processed through GetBooked.Live platform.`,
    ];

    for (const line of depositTerms) {
      y -= 18;
      page.drawText(`•  ${line}`, { x: 55, y, size: 9, font: helvetica, color: white });
    }

    // Cancellation policy
    y -= 35;
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
    y -= 25;
    page.drawText("CANCELLATION POLICY", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    const cancellation = [
      "30+ days before event: Full deposit refund.",
      "15-29 days before event: 50% deposit retained.",
      "Under 15 days: Full deposit non-refundable.",
      "Artist cancellation: Full deposit returned, plus 10% penalty.",
    ];

    for (const line of cancellation) {
      y -= 18;
      page.drawText(`•  ${line}`, { x: 55, y, size: 9, font: helvetica, color: white });
    }

    // Hospitality / backline notes
    if (offer?.hospitality || offer?.backline) {
      y -= 35;
      page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
      y -= 25;
      page.drawText("ADDITIONAL TERMS", {
        x: 50, y, size: 9, font: helveticaBold, color: lime,
      });

      if (offer.hospitality) {
        y -= 20;
        page.drawText("Hospitality:", { x: 50, y, size: 9, font: helveticaBold, color: gray });
        y -= 16;
        // Wrap text at ~80 chars
        const hospLines = wrapText(offer.hospitality, 80);
        for (const line of hospLines) {
          page.drawText(line, { x: 55, y, size: 9, font: helvetica, color: white });
          y -= 14;
        }
      }

      if (offer.backline) {
        y -= 8;
        page.drawText("Backline provided:", { x: 50, y, size: 9, font: helveticaBold, color: gray });
        y -= 16;
        const blLines = wrapText(offer.backline, 80);
        for (const line of blLines) {
          page.drawText(line, { x: 55, y, size: 9, font: helvetica, color: white });
          y -= 14;
        }
      }
    }

    // Signature section
    y -= 40;
    page.drawRectangle({ x: 50, y: y - 5, width: width - 100, height: 1, color: lineColor });
    y -= 30;
    page.drawText("SIGNATURES", {
      x: 50, y, size: 9, font: helveticaBold, color: lime,
    });

    y -= 30;
    // Artist signature line
    page.drawRectangle({ x: 50, y, width: 200, height: 1, color: gray });
    page.drawText(artistName, { x: 50, y: y - 14, size: 9, font: helvetica, color: gray });
    page.drawText("Artist / Performer", { x: 50, y: y - 26, size: 8, font: helvetica, color: gray });

    // Promoter signature line
    page.drawRectangle({ x: 320, y, width: 200, height: 1, color: gray });
    page.drawText(promoterName, { x: 320, y: y - 14, size: 9, font: helvetica, color: gray });
    page.drawText("Promoter / Buyer", { x: 320, y: y - 26, size: 8, font: helvetica, color: gray });

    // Footer
    page.drawText("Generated by GetBooked.Live — The music booking marketplace", {
      x: 50, y: 30, size: 7, font: helvetica, color: gray,
    });

    const pdfBytes = await pdfDoc.save();

    // Upload to storage
    const fileName = `contract-${booking.id}.pdf`;
    const filePath = `${booking.promoter_id}/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from("contracts")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadErr) {
      return new Response(JSON.stringify({ error: "Upload failed: " + uploadErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("contracts").getPublicUrl(filePath);
    const contractUrl = urlData.publicUrl;

    // Update booking with contract URL
    await supabase
      .from("bookings")
      .update({ contract_url: contractUrl })
      .eq("id", booking.id);

    return new Response(JSON.stringify({ contract_url: contractUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}
