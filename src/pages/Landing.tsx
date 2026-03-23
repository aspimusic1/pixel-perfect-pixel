import { useEffect, useRef } from "react";
import PageTransition from "@/components/PageTransition";
import HeroSection from "@/components/landing/HeroSection";
import ProfileMarquee from "@/components/landing/ProfileMarquee";
import PersonaSection from "@/components/landing/PersonaSection";
import PowerFeaturesSection from "@/components/landing/PowerFeaturesSection";
import RoleSwitcherSection from "@/components/landing/RoleSwitcherSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BuildShowSection from "@/components/landing/BuildShowSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FAQSection from "@/components/landing/FAQSection";
import BlogSection from "@/components/landing/BlogSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import RolePickerPopup from "@/components/RolePickerPopup";
import LockedDirectoryPreview from "@/components/landing/LockedDirectoryPreview";

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
      <div ref={revealRef} className="min-h-screen">
        <RolePickerPopup />
        <HeroSection />
        <ProfileMarquee />
        <PersonaSection />
        <LockedDirectoryPreview />
        <PowerFeaturesSection />
        <RoleSwitcherSection />
        <HowItWorksSection />
        <BuildShowSection />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingTeaser />
        <FAQSection />
        <BlogSection />
        <FinalCTA />
        <Footer />
      </div>
    </PageTransition>
  );
}
