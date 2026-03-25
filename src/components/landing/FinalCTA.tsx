import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-20 sm:py-32 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-foreground mb-4 leading-tight lowercase">
          stop negotiating in DMs.
        </h2>
        <p className="text-[16px] text-muted-foreground font-body mb-8">
          start closing real deals.
        </p>
        <Link to="/auth?tab=signup">
          <motion.button
            className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-10 h-12 hover:bg-primary/90 active:scale-[0.96] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            start free <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
