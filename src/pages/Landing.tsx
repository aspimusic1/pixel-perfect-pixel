import { useEffect, useRef } from "react";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";
import HeroSection from "@/components/landing/HeroSection";
import PersonaSection from "@/components/landing/PersonaSection";
import BuildShowSection from "@/components/landing/BuildShowSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhatMakesDifferentSection from "@/components/landing/WhatMakesDifferentSection";
import PowerFeaturesSection from "@/components/landing/PowerFeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import RolePickerPopup from "@/components/RolePickerPopup";

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
        <PersonaSection />
        <BuildShowSection />
        <HowItWorksSection />
        <WhatMakesDifferentSection />
        <PowerFeaturesSection />
        <TestimonialsSection />
        <PricingTeaser />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </div>
    </PageTransition>
  );
}
