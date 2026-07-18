import { THREAT_LEVELS, getThreatLevel } from "@/lib/hazards";

export function ThreatBar({ score }: { score: number }) {
  const active = getThreatLevel(score);

  return (
    <div>
      <div className="flex justify-between mb-1.5">
        {THREAT_LEVELS.map((t) => (
          <span
            key={t.label}
            className="font-display text-[8px] tracking-wide"
            style={{
              color: t.label === active.label ? t.colorHex : "#1e2d40",
              fontWeight: t.label === active.label ? 700 : 400,
            }}
          >
            {t.label}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {THREAT_LEVELS.map((t) => {
          const isActive = t.label === active.label;
          return (
            <div
              key={t.label}
              className="flex-1 h-2 rounded-sm transition-all duration-500"
              style={{
                backgroundColor: isActive ? t.colorHex : "#0c1520",
                boxShadow: isActive ? `0 0 12px ${t.colorHex}90` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
