import { HazardMeta, getThreatLevel } from "@/lib/hazards";
import { HazardWarning } from "@/lib/api";

interface Props {
  hazard: HazardMeta;
  score: number;
  warning?: HazardWarning;
}

function Gauge({ score, colorHex }: { score: number; colorHex: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <svg width={88} height={88} viewBox="0 0 88 88">
      <circle cx={44} cy={44} r={r} fill="none" stroke="#111d2e" strokeWidth={7} />
      <circle
        cx={44} cy={44} r={r} fill="none"
        stroke={colorHex} strokeWidth={7} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <text x={44} y={41} textAnchor="middle" fill={colorHex} fontSize={20} fontWeight={700} fontFamily="'Space Mono', monospace">
        {score}
      </text>
      <text x={44} y={55} textAnchor="middle" fill="#3d5068" fontSize={9} fontFamily="'Rajdhani', sans-serif">
        /100
      </text>
    </svg>
  );
}

export function HazardCard({ hazard, score, warning }: Props) {
  const level = getThreatLevel(score);
  const isHigh = score >= 65;

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden bg-base-card transition-all duration-300"
      style={{
        border: `1px solid ${isHigh ? hazard.colorHex + "45" : "#111d2e"}`,
        boxShadow: isHigh ? `0 0 30px ${hazard.colorHex}12` : "none",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${hazard.colorHex}${isHigh ? "ff" : "40"}, transparent)` }}
      />

      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-display text-[9px] tracking-[0.2em] text-base-muted mb-0.5">
            {hazard.icon} HAZARD
          </div>
          <div className="font-display text-[15px] font-bold tracking-wide">{hazard.label}</div>
        </div>
        <div
          className="font-display text-[9.5px] font-bold tracking-wide px-2 py-0.5 rounded"
          style={{ color: level.colorHex, backgroundColor: `${level.colorHex}18`, border: `1px solid ${level.colorHex}35` }}
        >
          {level.label}
        </div>
      </div>

      {warning && (
        <div className="bg-hazard-heat/10 border border-hazard-heat/40 rounded-lg px-2.5 py-2 mb-3 flex gap-2 items-start">
          <span className="text-xs leading-tight">⚠️</span>
          <span className="font-display text-[9px] text-hazard-heat font-semibold leading-snug tracking-wide">
            NOT VALIDATED OUTSIDE US — {warning.message}
          </span>
        </div>
      )}

      <div className="flex justify-center mb-2">
        <Gauge score={score} colorHex={hazard.colorHex} />
      </div>
    </div>
  );
}
