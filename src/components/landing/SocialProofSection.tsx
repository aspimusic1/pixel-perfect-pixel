import ProfileMarquee from "./ProfileMarquee";

export default function SocialProofSection() {
  return (
    <section className="fade-in-section py-16 sm:py-24">
      <div className="text-center mb-6 px-4">
        <span className="section-label">community</span>
        <h2 className="section-heading">the future of booking looks like this</h2>
      </div>
      <ProfileMarquee />
    </section>
  );
}
