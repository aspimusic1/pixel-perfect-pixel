const TESTIMONIALS = [
  {
    quote: "GetBooked replaced our entire spreadsheet system. We went from 3 hours of admin per booking to about 15 minutes.",
    name: "Daniela Reyes",
    role: "Promoter · Miami",
  },
  {
    quote: "The deal room is genius. Both sides see every milestone — no more 'did you send the rider?' texts.",
    name: "Marcus Webb",
    role: "Artist · Chicago",
  },
  {
    quote: "Flash bids filled two empty tour dates in 48 hours. That would've taken weeks the old way.",
    name: "Priya Nair",
    role: "Tour Manager",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="fade-in-section py-16 sm:py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-label">social proof</span>
          <h2 className="section-heading">trusted by the people who make shows happen</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl p-6 bg-card/80 border border-white/[0.06]"
            >
              <p className="text-[13px] text-white/80 font-body italic leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/[0.12] flex items-center justify-center text-xs font-display font-bold text-primary shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-[13px] font-display font-bold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BookScore stat card */}
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="shrink-0 text-center">
            <p className="font-display font-black text-5xl text-primary tabular-nums">4.8</p>
            <p className="text-[11px] text-muted-foreground font-body mt-1 uppercase tracking-wider">avg BookScore</p>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="font-display font-bold text-sm text-foreground lowercase mb-1">reputation you can verify</p>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              BookScore™ aggregates verified attendance, post-show reviews, and professionalism into one number — visible on every profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
