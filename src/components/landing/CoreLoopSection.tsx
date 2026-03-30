import { motion } from "framer-motion";
import { Megaphone, Mic2, FileText, CheckCircle2, RefreshCw } from "lucide-react";

const NODES = [
  { icon: Megaphone, label: "Promoter", sub: "Finds talent", color: "#FF5C8A" },
  { icon: Mic2, label: "Artist", sub: "Receives offer", color: "#C8FF3E" },
  { icon: FileText, label: "Offer", sub: "Terms & deal", color: "#FFB83E" },
  { icon: CheckCircle2, label: "Accepted", sub: "Deal closed", color: "#3EFFBE" },
  { icon: RefreshCw, label: "Repeat", sub: "Network grows", color: "#3EC8FF" },
];

export default function CoreLoopSection() {
  return (
    <section className="fade-in-section py-20 sm:py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-label">the flywheel</span>
          <h2 className="section-heading">every booking grows the network</h2>
          <p className="section-subtext mx-auto">
            More artists attract more promoters. More deals create more trust. The platform gets better with every show.
          </p>
        </div>

        {/* Loop visualization */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          {NODES.map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={node.label} className="flex items-center gap-1 sm:gap-2">
                <motion.div
                  className="flex flex-col items-center gap-2 rounded-2xl border p-4 sm:p-5 w-[80px] sm:w-[110px]"
                  style={{ borderColor: `${node.color}30`, backgroundColor: `${node.color}06` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  whileHover={{ y: -3, borderColor: `${node.color}60` }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${node.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: node.color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-display font-bold text-foreground">{node.label}</p>
                    <p className="text-[9px] text-muted-foreground font-body">{node.sub}</p>
                  </div>
                </motion.div>
                {i < NODES.length - 1 && (
                  <motion.div
                    className="text-muted-foreground/20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="hidden sm:block">
                      <path d="M0 6h16m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
