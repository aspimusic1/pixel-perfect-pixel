import SectionLabel from "@/components/landing/SectionLabel";

const TESTIMONIALS = [
  {
    quote: "GetBooked.Live completely changed how I manage my bookings. I went from juggling emails and spreadsheets to having everything in one place — offers, contracts, payments.",
    name: "Adrienne Cole",
    role: "Indie Artist",
    city: "Nashville, TN",
  },
  {
    quote: "The flash bids feature alone saved our festival. We had a headliner cancel 72 hours out and filled the slot with a perfect replacement in under 6 hours.",
    name: "Tomás Reyes",
    role: "Festival Promoter",
    city: "Austin, TX",
  },
  {
    quote: "As a venue owner, the directory and availability tools have brought in acts I never would have found otherwise. Our booking rate is up 40% since joining.",
    name: "Priya Nair",
    role: "Venue Manager",
    city: "Brooklyn, NY",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="fade-in-section py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <SectionLabel>testimonials</SectionLabel>
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3 lowercase tracking-tight">
            what our users say
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto font-body">
            real feedback from artists, promoters, and venues on the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative rounded-2xl border backdrop-blur-[12px] p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(200,255,62,0.06)] overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at top left, rgba(200,255,62,0.04), transparent), rgba(14, 20, 32, 0.6)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Large quote mark */}
              <span
                className="absolute top-4 left-5 font-display select-none pointer-events-none"
                style={{ fontSize: 80, color: "rgba(200,255,62,0.3)", lineHeight: 0.8 }}
              >
                &ldquo;
              </span>

              <div className="relative z-10 pt-10">
                <p className="text-foreground/85 font-body leading-[1.7] mb-6" style={{ fontSize: 15 }}>
                  {t.quote}
                </p>

                {/* Separator */}
                <div className="h-px w-full mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-sm text-foreground shrink-0"
                    style={{ boxShadow: "0 0 0 2px hsl(82 100% 62%), 0 0 16px rgba(200,255,62,0.3)" }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
