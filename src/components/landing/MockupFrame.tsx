import { ReactNode } from "react";

export default function MockupFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "0.5px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 80px rgba(200,255,62,0.12), 0 0 0 1px rgba(200,255,62,0.05)",
      }}
    >
      {/* macOS-style top bar */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 32,
          background: "rgba(20, 27, 40, 0.9)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
        <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
        <div className="w-2 h-2 rounded-full bg-[#28C840]" />
      </div>
      {/* Content */}
      <div style={{ background: "rgba(14, 20, 32, 0.8)" }}>
        {children}
      </div>
    </div>
  );
}
