import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`Processing Stripe event: ${event.type}`);

  try {
    switch (event.type) {
      // ─── Deposit / payment completed ───────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (!bookingId) {
          console.warn("checkout.session.completed: no booking_id in metadata");
          break;
        }

        if (session.payment_status !== "paid") {
          console.warn(`checkout.session.completed: payment_status is ${session.payment_status}, skipping`);
          break;
        }

        // Fetch the booking to determine what type of payment this is
        const { data: booking, error: bErr } = await supabase
          .from("bookings")
          .select("id, status, artist_id, promoter_id, guarantee, commission_rate, venue_name")
          .eq("id", bookingId)
          .single();

        if (bErr || !booking) {
          console.error("Booking not found:", bookingId, bErr);
          break;
        }

        const amountPaid = (session.amount_total ?? 0) / 100; // Convert from cents
        const depositAmount = Math.round(booking.guarantee * 0.25);
        const isDeposit = Math.abs(amountPaid - depositAmount) < 1; // within $1 tolerance
        const isFinalPayment = !isDeposit;

        const newStatus = isFinalPayment ? "completed" : "deposit_paid";
        const paymentType = isFinalPayment ? "final_payment" : "deposit";

        // Update booking status
        const { error: updateErr } = await supabase
          .from("bookings")
          .update({
            status: newStatus,
            [`${paymentType}_paid_at`]: new Date().toISOString(),
            [`${paymentType}_stripe_session_id`]: session.id,
            [`${paymentType}_amount`]: amountPaid,
          })
          .eq("id", bookingId);

        if (updateErr) {
          console.error("Failed to update booking status:", updateErr);
          // Try minimal update if extended columns don't exist yet
          await supabase
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", bookingId);
        }

        // If final payment, trigger artist payout via Stripe Connect transfer
        if (isFinalPayment && booking.artist_id) {
          const { data: artistProfile } = await supabase
            .from("profiles")
            .select("stripe_account_id, stripe_onboarding_complete")
            .eq("user_id", booking.artist_id)
            .single();

          if (artistProfile?.stripe_account_id && artistProfile?.stripe_onboarding_complete) {
            const commissionRate = booking.commission_rate ?? 0.20;
            const artistPayout = Math.round(booking.guarantee * (1 - commissionRate) * 100); // in cents

            try {
              await stripe.transfers.create({
                amount: artistPayout,
                currency: "usd",
                destination: artistProfile.stripe_account_id,
                description: `Payout for booking ${bookingId} — ${booking.venue_name}`,
                metadata: { booking_id: bookingId },
              });
              console.log(`Transfer created: $${artistPayout / 100} to ${artistProfile.stripe_account_id}`);
            } catch (transferErr: any) {
              console.error("Transfer failed:", transferErr.message);
            }
          } else {
            console.log(`Artist ${booking.artist_id} has no Stripe Connect account — payout skipped`);
          }
        }

        // Send notification to artist about payment
        const notifMessage = isDeposit
          ? `A deposit of $${amountPaid.toLocaleString()} has been paid for your booking at ${booking.venue_name}.`
          : `Final payment of $${amountPaid.toLocaleString()} received for ${booking.venue_name}. Payout initiated.`;

        await supabase.from("notifications").insert({
          user_id: booking.artist_id,
          type: "payment_received",
          title: isDeposit ? "Deposit received" : "Final payment received",
          message: notifMessage,
          booking_id: bookingId,
          is_read: false,
        }).then(({ error }) => {
          if (error) console.warn("Failed to create payment notification:", error.message);
        });

        console.log(`Booking ${bookingId} updated to ${newStatus}`);
        break;
      }

      // ─── Stripe Connect account updated ────────────────────────────────────
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        const userId = account.metadata?.user_id;

        if (!userId) {
          console.warn("account.updated: no user_id in metadata");
          break;
        }

        const isComplete = account.details_submitted ?? false;
        const payoutsEnabled = account.payouts_enabled ?? false;

        await supabase
          .from("profiles")
          .update({
            stripe_onboarding_complete: isComplete,
          })
          .eq("user_id", userId);

        console.log(`Stripe account ${account.id} updated: complete=${isComplete}, payouts=${payoutsEnabled}`);
        break;
      }

      // ─── Payment failed ─────────────────────────────────────────────────────
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const obj = event.data.object as any;
        const bookingId = obj.metadata?.booking_id;
        if (bookingId) {
          console.log(`Payment failed/expired for booking ${bookingId}`);
          // Optionally notify the promoter here
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (handlerErr: any) {
    console.error("Event handler error:", handlerErr.message);
    // Return 200 to prevent Stripe from retrying — log the error instead
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
