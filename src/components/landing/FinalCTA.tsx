import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_BUTTONS = [
  { label: "Join as Artist", color: "#C8FF3E", link: "/auth?mode=signup&role=artist" },
  { label: "Join as Promoter", color: "#FF5C8A", link: "/auth?mode=signup&role=promoter" },
  { label: "Join as Venue", color: "#FFB83E", link: "/auth?mode=signup&role=venue" },
  { label: "Join as Production", color: "#7B5CF0", link: "/auth?mode=signup&role=production" },
  { label: "Join as Creative", color: "#3EC8FF", link: "/auth?mode=signup&role=photo_video" },
];

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="font-display font-extrabold text-[clamp(24px,4vw,38px)] text-foreground leading-[1.1] mb-4 lowercase">
          one platform. every role. every show.
        </h2>
        <p className="text-[15px] text-muted-foreground font-body leading-relaxed mb-10 max-w-md mx-auto">
          free to join. first booking takes minutes. no credit card required.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {ROLE_BUTTONS.map((btn, i) => (
            <Link key={btn.label} to={btn.link}>
              <motion.button
                className="font-display font-bold text-sm rounded-[10px] px-6 h-11 transition-all inline-flex items-center gap-2 lowercase"
                style={{ backgroundColor: btn.color, color: "#080C14" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
              >
                {btn.label} <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
              </motion.button>
            </Link>
          ))}
        </div>

        <Link to="/directory" className="inline-block mt-4">
          <motion.button
            className="border border-white/[0.1] text-foreground font-display font-medium text-sm rounded-[10px] px-7 h-11 hover:bg-secondary hover:border-white/[0.15] transition-all lowercase"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            browse directory
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
