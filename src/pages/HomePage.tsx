import { useEffect, useRef } from "react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import HeroSection from "@/components/landing/HeroSection";
import RoleSelectorSection from "@/components/landing/RoleSelectorSection";
import ProblemSection from "@/components/landing/ProblemSection";
import CoreValueSection from "@/components/landing/CoreValueSection";
import RoleValueSection from "@/components/landing/RoleValueSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturePreviewSection from "@/components/landing/FeaturePreviewSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

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
        title="GetBooked.Live — The Operating System for Live Bookings"
        description="The all-in-one platform for live music. Connect artists, promoters, venues, and crews. Structured offers, contracts, and payments."
        canonical="https://getbookedlive.lovable.app/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GetBooked.Live",
          url: "https://getbookedlive.lovable.app",
          description: "The all-in-one platform for live music booking.",
        }}
      />
      <div ref={revealRef} className="min-h-screen">
        <HeroSection />
        <RoleSelectorSection />
        <ProblemSection />
        <CoreValueSection />
        <RoleValueSection />
        <SocialProofSection />
        <HowItWorksSection />
        <FeaturePreviewSection />
        <PricingTeaser />
        <FinalCTA />
        <Footer />
      </div>
    </PageTransition>
  );
}
