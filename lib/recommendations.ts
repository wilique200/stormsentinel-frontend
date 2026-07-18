// Tiered safety guidance per hazard, shown only at MODERATE severity or
// above. Same content as the validated Streamlit version — standard
// public-safety guidance patterns (NWS, CDC, Ready.gov), not reinvented.

type Tier = "moderate" | "elevated" | "high" | "extreme";

export const RECOMMENDATIONS: Record<string, Record<Tier, string[]>> = {
  wildfire: {
    moderate: ["Monitor local air quality and fire updates", "Know your evacuation routes in advance"],
    elevated: ["Avoid any outdoor burning", "Keep vehicles fueled with a go-bag packed", "Watch for local evacuation notices"],
    high: ["Prepare to evacuate on short notice", "Clear dry vegetation near structures", "Keep N95 masks on hand for smoke exposure"],
    extreme: ["Follow local evacuation orders immediately", "Avoid the area if at all possible", "Keep windows closed; use air purifiers indoors"],
  },
  tornado: {
    moderate: ["Review your household's tornado safety plan", "Keep a charged weather radio or phone alerts on"],
    elevated: ["Stay alert to weather alerts through the day", "Identify your safe room — interior, lowest floor, no windows"],
    high: ["Postpone outdoor plans", "Keep shoes and a flashlight near your safe room"],
    extreme: ["Take shelter immediately if a warning is issued", "Stay away from windows and mobile homes"],
  },
  hail: {
    moderate: ["Move vehicles under cover if possible"],
    elevated: ["Park vehicles in a garage or covered area", "Secure outdoor furniture and equipment"],
    high: ["Stay indoors, away from windows and skylights", "Avoid driving until the storm passes"],
    extreme: ["Take shelter immediately", "Do not go outside until conditions clear"],
  },
  thunderstorm_wind: {
    moderate: ["Secure loose outdoor items"],
    elevated: ["Bring in patio furniture and anything that could become a projectile"],
    high: ["Avoid parking under trees or power lines", "Stay indoors"],
    extreme: ["Stay away from windows", "Be prepared for possible power outages"],
  },
  flash_flood: {
    moderate: ["Avoid low-lying areas after heavy rain"],
    elevated: ["Know your route to higher ground", "Avoid spending time in basements during heavy rain"],
    high: ["Never drive through flooded roads — turn around, don't drown", "Move valuables to higher ground"],
    extreme: ["Evacuate low-lying areas immediately if instructed", "Never walk or drive through moving floodwater"],
  },
  heat: {
    moderate: ["Stay hydrated", "Limit strenuous outdoor activity during peak afternoon hours"],
    elevated: ["Check on elderly neighbors and relatives", "Never leave children or pets in parked vehicles"],
    high: ["Limit outdoor exposure between 11am–4pm", "Seek air-conditioned spaces when possible", "Wear light, breathable clothing"],
    extreme: ["Avoid outdoor activity entirely if possible", "Watch for signs of heat exhaustion or heat stroke (confusion, rapid pulse, hot dry skin) and seek medical help immediately if they occur"],
  },
  drought: {
    moderate: ["Be mindful of water usage", "Check for local watering restrictions"],
    elevated: ["Reduce non-essential water use — lawn watering, car washing", "Watch for local water advisories"],
    high: ["Follow local water conservation mandates", "Be alert to elevated wildfire risk, which often accompanies drought"],
    extreme: ["Comply with any mandatory water restrictions", "Monitor local emergency advisories closely"],
  },
};

const LEVEL_TO_TIER: Record<string, Tier | undefined> = {
  MODERATE: "moderate",
  ELEVATED: "elevated",
  HIGH: "high",
  EXTREME: "extreme",
};

export function getTierForLevel(levelLabel: string): Tier | null {
  return LEVEL_TO_TIER[levelLabel] || null;
}
