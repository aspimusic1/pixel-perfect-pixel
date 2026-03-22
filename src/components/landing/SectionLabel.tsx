import { ReactNode } from "react";

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.08em] text-primary mb-3 font-display"
      style={{
        background: "rgba(200,255,62,0.08)",
        border: "0.5px solid rgba(200,255,62,0.2)",
      }}
    >
      {children}
    </span>
  );
}
