const TESTIMONIALS = [
  { quote: "GetBooked replaced our entire spreadsheet system. We went from 3 hours of admin per booking to about 15 minutes.", name: "Daniela Reyes", role: "Promoter · Miami" },
  { quote: "The deal room is genius. Both sides see every milestone — no more 'did you send the rider?' texts.", name: "Marcus Webb", role: "Artist · Chicago" },
  { quote: "Flash bids filled two empty tour dates in 48 hours. That would've taken weeks the old way.", name: "Priya Nair", role: "Tour Manager" },
  { quote: "I love that I can see real attendance data on an artist's profile before I book them. No more guessing.", name: "Tomás Herrera", role: "Promoter · Austin" },
  { quote: "Income smoothing changed my life. I finally know what I'm earning every month instead of feast-or-famine.", name: "Aisha Coleman", role: "Artist · Atlanta" },
  { quote: "The transport section saved us $2k on our last run. We booked a sprinter for 6 stops in one click.", name: "Jake Lindgren", role: "Production · Nashville" },
];

const FEATURED = {
  quote: "This is the platform the live music industry has been waiting for. It's not just a booking tool — it's the entire operating system for getting shows done right.",
  name: "Camille Laurent",
  role: "Agency Director · New York",
};

export default function TestimonialsSection() {
  return (
    <section className="fade-in-section py-16 sm:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-label">testimonials</span>
          <h2 className="section-heading">loved by artists, promoters, and crews</h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 gap-3 space-y-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="break-inside-avoid rounded-[14px] p-5 bg-card/80 border border-white/[0.06]"
            >
              <p className="text-[13px] text-white/80 font-body italic leading-relaxed mb-4">"{t.quote}"</p>
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

        {/* Featured large quote */}
        <div className="mt-10 rounded-2xl bg-card/60 border border-white/[0.08] p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
          <div className="flex-1 min-w-0">
            <span className="text-primary font-display text-[80px] leading-none block -mb-6">"</span>
            <p className="font-display font-bold text-lg sm:text-xl text-foreground leading-snug max-w-[600px]">
              {FEATURED.quote}
            </p>
            <div className="mt-5">
              <p className="text-sm font-display font-bold text-foreground">{FEATURED.name}</p>
              <p className="text-xs text-muted-foreground font-body">{FEATURED.role}</p>
            </div>
          </div>
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-full bg-primary/[0.12] flex items-center justify-center text-2xl font-display font-bold text-primary shadow-[0_0_0_3px_hsl(var(--primary))]">
              {FEATURED.name[0]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
