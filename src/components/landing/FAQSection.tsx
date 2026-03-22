import { useState } from "react";
import { Plus, X } from "lucide-react";
import SectionLabel from "@/components/landing/SectionLabel";

const FAQS = [
  {
    q: "What is GetBooked.Live?",
    a: "GetBooked.Live is an all-in-one platform for the live music industry. It connects artists, promoters, venues, production teams, and photographers/videographers — handling everything from the first offer to the final payout.",
  },
  {
    q: "How does the commission system work?",
    a: "Free accounts pay a 25% platform commission on confirmed bookings. Pro members ($29/mo) pay only 10%, and Business accounts ($79/mo) pay just 5%. Commission is automatically calculated and deducted — you always see your net payout upfront.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes! GetBooked.Live is fully responsive and works on any device. You can manage offers, respond to messages, and track your bookings from your phone or tablet.",
  },
  {
    q: "How do I get verified?",
    a: "Verification happens automatically once you connect your Spotify account, complete your profile, and receive your first confirmed booking. Verified profiles get a badge and higher placement in the directory.",
  },
  {
    q: "What happens after an offer is accepted?",
    a: "Once accepted, a private Deal Room is created for both parties. It includes milestones, contract signing, messaging, logistics coordination, and payment tracking — all in one place.",
  },
  {
    q: "Is there a free plan?",
    a: "Absolutely. The free plan lets you create your profile, receive and respond to offers, and get listed in the directory. Upgrade to Pro or Business when you're ready for unlimited offers, lower commissions, and advanced tools.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="fade-in-section py-28 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-16">
          <SectionLabel>faq</SectionLabel>
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3 lowercase tracking-tight">
            frequently asked questions
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto font-body">
            everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl backdrop-blur-[12px] transition-all duration-300 overflow-hidden"
                style={{
                  background: "rgba(14, 20, 32, 0.6)",
                  border: isOpen ? "0.5px solid rgba(200,255,62,0.2)" : "0.5px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left active:scale-[0.99] transition-transform"
                >
                  <span className="font-display font-semibold text-sm text-foreground">{faq.q}</span>
                  <span className="shrink-0 text-primary transition-transform duration-300" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="px-5 pb-5 text-[13px] font-body leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
