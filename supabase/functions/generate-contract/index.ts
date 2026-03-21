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
      Deno.env.get("SUPABASE_ANON_KEY")!,
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

    const [artistRes, promoterRes] = await Promise.all([
      supabase.from("profiles").select("display_name, city, state").eq("user_id", booking.artist_id).single(),
      supabase.from("profiles").select("display_name, city, state").eq("user_id", booking.promoter_id).single(),
    ]);

    const artistName = artistRes.data?.display_name ?? "Artist";
    const promoterName = promoterRes.data?.display_name ?? "Promoter";
    const artistLocation = [artistRes.data?.city, artistRes.data?.state].filter(Boolean).join(", ");
    const promoterLocation = [promoterRes.data?.city, promoterRes.data?.state].filter(Boolean).join(", ");

    // ─── Brand palette ───
    const bgDark = rgb(0.02, 0.03, 0.05);       // #050810
    const cardBg = rgb(0.055, 0.078, 0.125);     // #0E1420
    const cardBg2 = rgb(0.078, 0.106, 0.157);    // #141B28
    const lime = rgb(0.784, 1, 0.243);            // #C8FF3E
    const limeDim = rgb(0.47, 0.6, 0.145);        // dimmed lime for subtle accents
    const teal = rgb(0.243, 1, 0.745);            // #3EFFBE
    const white = rgb(0.941, 0.949, 0.969);       // #F0F2F7
    const textMuted = rgb(0.533, 0.573, 0.643);   // #8892A4
    const textDim = rgb(0.353, 0.392, 0.471);     // #5A6478
    const borderColor = rgb(0.15, 0.17, 0.21);
    const destructive = rgb(1, 0.36, 0.36);        // #FF5C5C for fees

    // ─── Create PDF ───
    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    const margin = 48;
    const contentWidth = width - margin * 2;

    // ─── Full-page dark background ───
    page.drawRectangle({ x: 0, y: 0, width, height, color: bgDark });

    // ─── Top accent bar (lime) ───
    page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: lime });

    let y = height - 50;

    // ─── Header section ───
    // Logo text in bold lime
    page.drawText("GETBOOKED", {
      x: margin, y, size: 18, font: helveticaBold, color: lime,
    });
    const gbWidth = helveticaBold.widthOfTextAtSize("GETBOOKED", 18);
    page.drawText(".LIVE", {
      x: margin + gbWidth, y, size: 18, font: helveticaBold, color: white,
    });

    // Contract number right-aligned
    const contractId = booking.id.substring(0, 8).toUpperCase();
    const contractLabel = `#${contractId}`;
    const contractLabelWidth = helvetica.widthOfTextAtSize(contractLabel, 9);
    page.drawText(contractLabel, {
      x: width - margin - contractLabelWidth, y: y + 2, size: 9, font: helvetica, color: textDim,
    });

    y -= 28;

    // Title
    page.drawText("Performance Agreement", {
      x: margin, y, size: 22, font: helveticaBold, color: white,
    });

    y -= 16;
    const contractDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    page.drawText(`Issued ${contractDate}`, {
      x: margin, y, size: 9, font: helveticaOblique, color: textDim,
    });

    // ─── Divider ───
    y -= 18;
    page.drawRectangle({ x: margin, y, width: contentWidth, height: 1, color: borderColor });

    // ─── Helper: draw section label with lime dot ───
    function drawSectionLabel(label: string, yPos: number): number {
      // Lime dot
      page.drawCircle({ x: margin + 4, y: yPos + 3, size: 3, color: lime });
      page.drawText(label, {
        x: margin + 14, y: yPos, size: 8.5, font: helveticaBold, color: lime,
      });
      return yPos - 20;
    }

    // ─── Helper: draw a card background ───
    function drawCard(yTop: number, cardHeight: number, bg = cardBg) {
      const radius = 6;
      // Rounded card approximation (rectangle with slight inset)
      page.drawRectangle({
        x: margin, y: yTop - cardHeight, width: contentWidth, height: cardHeight,
        color: bg, borderColor: borderColor, borderWidth: 0.5,
      });
    }

    // ─── Helper: draw key-value row ───
    function drawKV(label: string, value: string, yPos: number, opts?: { valueColor?: typeof lime; valueSize?: number; valueFont?: typeof helveticaBold }) {
      page.drawText(label, { x: margin + 16, y: yPos, size: 9, font: helvetica, color: textMuted });
      page.drawText(value, {
        x: margin + 160, y: yPos, size: opts?.valueSize ?? 10,
        font: opts?.valueFont ?? helveticaBold, color: opts?.valueColor ?? white,
      });
      return yPos - 20;
    }

    // ═══════════════════════════════════════════
    // PARTIES
    // ═══════════════════════════════════════════
    y -= 22;
    y = drawSectionLabel("PARTIES", y);

    const partiesHeight = artistLocation || promoterLocation ? 56 : 44;
    drawCard(y, partiesHeight);

    const partiesY = y - 18;
    // Artist column
    page.drawText("Artist / Performer", { x: margin + 16, y: partiesY, size: 8, font: helvetica, color: textDim });
    page.drawText(artistName, { x: margin + 16, y: partiesY - 14, size: 12, font: helveticaBold, color: white });
    if (artistLocation) {
      page.drawText(artistLocation, { x: margin + 16, y: partiesY - 28, size: 8, font: helvetica, color: textMuted });
    }

    // Promoter column
    const col2 = margin + contentWidth / 2 + 10;
    page.drawText("Promoter / Buyer", { x: col2, y: partiesY, size: 8, font: helvetica, color: textDim });
    page.drawText(promoterName, { x: col2, y: partiesY - 14, size: 12, font: helveticaBold, color: white });
    if (promoterLocation) {
      page.drawText(promoterLocation, { x: col2, y: partiesY - 28, size: 8, font: helvetica, color: textMuted });
    }

    // Vertical divider between parties
    page.drawRectangle({
      x: margin + contentWidth / 2, y: y - partiesHeight + 10, width: 1, height: partiesHeight - 20, color: borderColor,
    });

    y -= partiesHeight + 16;

    // ═══════════════════════════════════════════
    // EVENT DETAILS
    // ═══════════════════════════════════════════
    y = drawSectionLabel("EVENT DETAILS", y);

    const eventDate = new Date(booking.event_date).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

    const eventRows = [
      ["Venue", booking.venue_name],
      ["Date", eventDate],
      ...(booking.event_time ? [["Time", formatTime(booking.event_time)]] : []),
    ];
    const eventCardH = eventRows.length * 20 + 16;
    drawCard(y, eventCardH);
    let ey = y - 16;
    for (const [label, value] of eventRows) {
      ey = drawKV(label, String(value), ey);
    }
    y -= eventCardH + 16;

    // ═══════════════════════════════════════════
    // FINANCIAL TERMS
    // ═══════════════════════════════════════════
    y = drawSectionLabel("FINANCIAL TERMS", y);

    const guarantee = Number(offer?.guarantee ?? booking.guarantee);
    const commissionRate = Number(offer?.commission_rate ?? 0.1);
    const commission = Math.floor(guarantee * commissionRate);
    const artistPayout = guarantee - commission;

    const finRows = [
      { label: "Guarantee", value: `$${guarantee.toLocaleString()}`, color: white },
      ...(offer?.door_split ? [{ label: "Door Split", value: `${offer.door_split}%`, color: white }] : []),
      ...(offer?.merch_split ? [{ label: "Merch Split", value: `${offer.merch_split}%`, color: white }] : []),
      { label: "Platform Fee", value: `-$${commission.toLocaleString()} (${(commissionRate * 100).toFixed(0)}%)`, color: destructive },
    ];
    const finCardH = (finRows.length + 1) * 20 + 26; // +1 for payout + divider
    drawCard(y, finCardH, cardBg2);
    let fy = y - 16;
    for (const row of finRows) {
      fy = drawKV(row.label, row.value, fy, { valueColor: row.color });
    }
    // Divider before net payout
    fy -= 4;
    page.drawRectangle({ x: margin + 16, y: fy + 8, width: contentWidth - 32, height: 1, color: borderColor });
    fy -= 8;
    fy = drawKV("Artist Net Payout", `$${artistPayout.toLocaleString()}`, fy, {
      valueColor: lime, valueSize: 13, valueFont: helveticaBold,
    });
    y -= finCardH + 16;

    // ═══════════════════════════════════════════
    // DEPOSIT & PAYMENT
    // ═══════════════════════════════════════════
    y = drawSectionLabel("DEPOSIT & PAYMENT", y);

    const deposit = Math.round(guarantee * 0.5);
    const depositTerms = [
      `50% deposit ($${deposit.toLocaleString()}) due within 14 days of signing`,
      `Remaining balance ($${(guarantee - deposit).toLocaleString()}) due on event day`,
      `All payments processed through GetBooked.Live`,
    ];
    const depCardH = depositTerms.length * 16 + 16;
    drawCard(y, depCardH);
    let dy = y - 14;
    for (const line of depositTerms) {
      page.drawText("•", { x: margin + 16, y: dy, size: 8, font: helveticaBold, color: limeDim });
      page.drawText(line, { x: margin + 28, y: dy, size: 8.5, font: helvetica, color: white });
      dy -= 16;
    }
    y -= depCardH + 16;

    // ═══════════════════════════════════════════
    // CANCELLATION POLICY
    // ═══════════════════════════════════════════
    y = drawSectionLabel("CANCELLATION POLICY", y);

    const cancelTerms = [
      "30+ days notice: Full deposit refund",
      "15–29 days notice: 50% deposit retained",
      "Under 15 days: Full deposit non-refundable",
      "Artist cancellation: Deposit returned + 10% penalty",
    ];
    const cancelCardH = cancelTerms.length * 16 + 16;
    drawCard(y, cancelCardH);
    let cy = y - 14;
    for (const line of cancelTerms) {
      page.drawText("•", { x: margin + 16, y: cy, size: 8, font: helveticaBold, color: limeDim });
      page.drawText(line, { x: margin + 28, y: cy, size: 8.5, font: helvetica, color: white });
      cy -= 16;
    }
    y -= cancelCardH + 16;

    // ═══════════════════════════════════════════
    // ADDITIONAL TERMS (if any)
    // ═══════════════════════════════════════════
    if (offer?.hospitality || offer?.backline || offer?.notes) {
      y = drawSectionLabel("ADDITIONAL TERMS", y);

      const addLines: { label: string; value: string }[] = [];
      if (offer.hospitality) addLines.push({ label: "Hospitality", value: offer.hospitality });
      if (offer.backline) addLines.push({ label: "Backline", value: offer.backline });
      if (offer.notes) addLines.push({ label: "Notes", value: offer.notes });

      let totalH = 12;
      const wrappedEntries: { label: string; lines: string[] }[] = [];
      for (const entry of addLines) {
        const lines = wrapText(entry.value, 65);
        wrappedEntries.push({ label: entry.label, lines });
        totalH += 16 + lines.length * 14 + 6;
      }

      drawCard(y, totalH);
      let ay = y - 14;
      for (const entry of wrappedEntries) {
        page.drawText(entry.label, { x: margin + 16, y: ay, size: 8.5, font: helveticaBold, color: textMuted });
        ay -= 14;
        for (const line of entry.lines) {
          page.drawText(line, { x: margin + 16, y: ay, size: 9, font: helvetica, color: white });
          ay -= 14;
        }
        ay -= 4;
      }
      y -= totalH + 16;
    }

    // ═══════════════════════════════════════════
    // SIGNATURES
    // ═══════════════════════════════════════════
    // Ensure enough room — if y is too low, don't draw (single page constraint)
    if (y > 80) {
      y -= 6;
      page.drawRectangle({ x: margin, y, width: contentWidth, height: 1, color: borderColor });
      y -= 28;

      const sigLineWidth = (contentWidth - 40) / 2;

      // Artist signature
      page.drawRectangle({ x: margin, y, width: sigLineWidth, height: 1, color: textDim });
      page.drawText(artistName, { x: margin, y: y - 14, size: 9, font: helveticaBold, color: white });
      page.drawText("Artist / Performer", { x: margin, y: y - 26, size: 7.5, font: helvetica, color: textDim });

      // Promoter signature
      const sig2x = margin + sigLineWidth + 40;
      page.drawRectangle({ x: sig2x, y, width: sigLineWidth, height: 1, color: textDim });
      page.drawText(promoterName, { x: sig2x, y: y - 14, size: 9, font: helveticaBold, color: white });
      page.drawText("Promoter / Buyer", { x: sig2x, y: y - 26, size: 7.5, font: helvetica, color: textDim });
    }

    // ─── Footer bar ───
    page.drawRectangle({ x: 0, y: 0, width, height: 28, color: cardBg });
    page.drawRectangle({ x: 0, y: 28, width, height: 1, color: borderColor });

    const footerText = "Generated by GetBooked.Live  —  The music booking marketplace";
    const footerWidth = helvetica.widthOfTextAtSize(footerText, 7);
    page.drawText(footerText, {
      x: (width - footerWidth) / 2, y: 10, size: 7, font: helvetica, color: textDim,
    });

    // Small lime accent dot in footer
    page.drawCircle({ x: margin, y: 14, size: 2, color: lime });

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

    const { data: urlData } = supabase.storage.from("contracts").getPublicUrl(filePath);
    const contractUrl = urlData.publicUrl;

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

function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}
