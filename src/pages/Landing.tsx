import { useEffect, useRef } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ProfileMarquee from "@/components/landing/ProfileMarquee";
import PowerFeaturesSection from "@/components/landing/PowerFeaturesSection";
import RoleSwitcherSection from "@/components/landing/RoleSwitcherSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingTeaser from "@/components/landing/PricingTeaser";
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
    <div ref={revealRef} className="min-h-screen">
      <RolePickerPopup />
      <HeroSection />
      <ProfileMarquee />
      <LockedDirectoryPreview />
      <PowerFeaturesSection />
      <RoleSwitcherSection />
      <HowItWorksSection />
      <PricingTeaser />
      <FinalCTA />
      <Footer />
    </div>
  );
}
