/* Landing page – redesigned */
import { useEffect, useRef } from "react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PowerFeaturesSection from "@/components/landing/PowerFeaturesSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CoreLoopSection from "@/components/landing/CoreLoopSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    el.querySelectorAll(".fade-in-section").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Landing() {
  const revealRef = useScrollReveal();

  return (
    <PageTransition>
      <SEO
        title="GetBooked.Live — Book Artists, Close Deals, Run Shows"
        description="The all-in-one platform for live music. Connect artists, promoters, venues, and creatives. Structured offers, auto-contracts, tour management."
        canonical="https://getbookedlive.lovable.app/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GetBooked.Live",
          url: "https://getbookedlive.lovable.app",
          description: "The all-in-one platform for live music booking.",
          logo: "https://getbookedlive.lovable.app/og-image.png",
        }}
      />
      <div ref={revealRef} className="min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <PowerFeaturesSection />
        <SocialProofSection />
        <CoreLoopSection />
        <PricingTeaser />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </div>
    </PageTransition>
  );
}
