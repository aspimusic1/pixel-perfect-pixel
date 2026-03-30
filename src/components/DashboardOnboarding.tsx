"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Send, BarChart3, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  {
    icon: Search,
    label: "Find Artists",
    desc: "Browse verified profiles",
    link: "/directory",
    color: "#C8FF3E",
    glow: "rgba(200,255,62,0.2)",
  },
  {
    icon: Send,
    label: "Send Offer",
    desc: "Start a new booking",
    link: "/directory",
    color: "#FF5C8A",
    glow: "rgba(255,92,138,0.2)",
  },
  {
    icon: BarChart3,
    label: "Manage Deals",
    desc: "Track active bookings",
    link: "/dashboard",
    color: "#FFB83E",
    glow: "rgba(255,184,62,0.2)",
  },
  {
    icon: User,
    label: "Update Profile",
    desc: "Complete your setup",
    link: "/dashboard",
    color: "#3EC8FF",
    glow: "rgba(62,200,255,0.2)",
  },
];

const STORAGE_KEY = "gb_onboarding_dismissed";

export default function DashboardOnboarding() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <p className="text-[11px] font-display font-bold tracking-[0.18em] uppercase text-primary/70 mb-1">
            quick start
          </p>
          <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-4">
            What do you want to do today?
          </h3>

          {/* Action cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} to={action.link} onClick={dismiss}>
                  <motion.div
                    className="flex flex-col gap-2 rounded-xl border p-4 h-[90px] cursor-pointer"
                    style={{
                      borderColor: `${action.color}25`,
                      backgroundColor: `${action.color}08`,
                    }}
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: `${action.color}15`,
                      borderColor: `${action.color}50`,
                      boxShadow: `0 0 20px ${action.glow}`,
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: action.color }} />
                    <div>
                      <p className="text-[12px] font-display font-bold text-foreground leading-tight">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-white/40 font-body mt-0.5 leading-tight">
                        {action.desc}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
