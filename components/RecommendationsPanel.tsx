import { HAZARDS, getThreatLevel } from "@/lib/hazards";
import { RECOMMENDATIONS, getTierForLevel } from "@/lib/recommendations";

interface Props {
  scores: Record<string, number>;
  isUs: boolean;
}

export function RecommendationsPanel({ scores, isUs }: Props) {
  // Non-US locations only get recommendations from the 2 globally-grounded
  // hazards — generating "prepare your tornado safe room" advice from a
  // score we've already flagged as unvalidated would undercut the honesty
  // built into the cards themselves.
  const eligible = HAZARDS.filter((h) => isUs || !h.usOnly)
    .map((h) => ({ hazard: h, score: scores[h.key] ?? 0, level: getThreatLevel(scores[h.key] ?? 0) }))
    .filter((e) => getTierForLevel(e.level.label) !== null)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="mt-5">
      <div className="font-display text-[9px] tracking-[0.25em] text-base-muted mb-2.5">
        RECOMMENDATIONS
      </div>

      {eligible.length === 0 ? (
        <div className="bg-base-panel border border-base-line rounded-xl px-4 py-3.5 flex items-center gap-2.5">
          <span className="text-lg">✅</span>
          <span className="font-body text-xs text-base-muted">
            No elevated risks detected right now — no specific action needed beyond normal weather awareness.
          </span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {eligible.map(({ hazard, score, level }) => {
            const tier = getTierForLevel(level.label)!;
            const tips = RECOMMENDATIONS[hazard.key][tier];
            return (
              <div
                key={hazard.key}
                className="bg-base-card rounded-lg px-4 py-3.5"
                style={{ border: `1px solid ${hazard.colorHex}35`, borderLeft: `3px solid ${hazard.colorHex}` }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-display text-[13px] font-bold tracking-wide">
                    {hazard.icon} {hazard.label}
                  </span>
                  <span
                    className="font-display text-[9px] font-bold tracking-wide px-2 py-0.5 rounded"
                    style={{ color: level.colorHex, backgroundColor: `${level.colorHex}18` }}
                  >
                    {level.label} · {score}/100
                  </span>
                </div>
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 mt-1.5">
                    <span style={{ color: hazard.colorHex }} className="text-xs leading-relaxed">▸</span>
                    <span className="font-body text-[11.5px] text-gray-300 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
