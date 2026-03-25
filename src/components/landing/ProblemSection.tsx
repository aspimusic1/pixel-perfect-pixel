const PROBLEMS = [
  "Artists chase promoters",
  "Promoters chase talent",
  "Venues chase events",
  "Creatives chase gigs",
  "Everything happens in DMs",
  "Deals fall apart",
];

export default function ProblemSection() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <span className="section-label">the problem</span>
        <h2 className="section-heading mb-10">booking live events is broken</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-4 border border-border text-[13px] text-muted-foreground font-body"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {p}
            </div>
          ))}
        </div>

        <p className="font-display font-bold text-lg sm:text-xl text-foreground">
          GetBooked.Live <span className="text-primary">fixes that.</span>
        </p>
      </div>
    </section>
  );
}
