export interface HazardMeta {
  key: string;
  label: string;
  icon: string;
  colorToken: string; // tailwind color token, e.g. "hazard-wildfire"
  colorHex: string;   // for inline SVG/canvas use where Tailwind classes don't reach
  usOnly: boolean;
}

export const HAZARDS: HazardMeta[] = [
  { key: "wildfire", label: "WILDFIRE", icon: "🔥", colorToken: "hazard-wildfire", colorHex: "#F97316", usOnly: false },
  { key: "tornado", label: "TORNADO", icon: "🌪️", colorToken: "hazard-tornado", colorHex: "#8B5CF6", usOnly: true },
  { key: "hail", label: "HAIL", icon: "🧊", colorToken: "hazard-hail", colorHex: "#22C55E", usOnly: true },
  { key: "thunderstorm_wind", label: "THUNDERSTORM WIND", icon: "⚡", colorToken: "hazard-thunderstorm", colorHex: "#3B82F6", usOnly: true },
  { key: "flash_flood", label: "FLASH FLOOD", icon: "🌊", colorToken: "hazard-flashflood", colorHex: "#06B6D4", usOnly: false },
  { key: "heat", label: "EXTREME HEAT", icon: "🌡️", colorToken: "hazard-heat", colorHex: "#EF4444", usOnly: false },
  { key: "drought", label: "DROUGHT", icon: "☀️", colorToken: "hazard-drought", colorHex: "#EAB308", usOnly: false },
];

export interface ThreatLevel {
  label: string;
  max: number;
  colorHex: string;
}

export const THREAT_LEVELS: ThreatLevel[] = [
  { label: "MINIMAL", max: 15, colorHex: "#22C55E" },
  { label: "LOW", max: 30, colorHex: "#84CC16" },
  { label: "MODERATE", max: 50, colorHex: "#EAB308" },
  { label: "ELEVATED", max: 65, colorHex: "#F97316" },
  { label: "HIGH", max: 80, colorHex: "#EF4444" },
  { label: "EXTREME", max: 100, colorHex: "#DC2626" },
];

export function getThreatLevel(score: number): ThreatLevel {
  return THREAT_LEVELS.find((t) => score <= t.max) || THREAT_LEVELS[THREAT_LEVELS.length - 1];
}
