export function BrandHeader({ size = "default" }: { size?: "default" | "large" }) {
  const isLarge = size === "large";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${isLarge ? "w-12 h-12 text-2xl" : "w-9 h-9 text-base"} rounded-lg flex items-center justify-center flex-shrink-0`}
        style={{ background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)" }}
      >
        ⚡
      </div>
      <div>
        <div
          className={`font-display font-bold text-base-void-fg tracking-[0.2em] leading-tight ${isLarge ? "text-2xl" : "text-base"}`}
          style={{ color: "#dde4ee" }}
        >
          STORMSENTINEL AI
        </div>
        <div className="font-display text-[9px] tracking-[0.25em] text-base-muted">
          MULTI-HAZARD · AI RISK INTELLIGENCE
        </div>
      </div>
    </div>
  );
}
