// ============================================================================
// StormSentinel Frontend — API Client
// Every backend call goes through here. Handles auth token attachment and
// error normalization in one place, so components never touch fetch()
// directly — matches the backend's actual response shapes exactly.
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stormsentinel_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // response wasn't JSON — keep statusText
    }
    throw new ApiError(detail, res.status);
  }

  return res.json();
}

// ── Types matching the backend's Pydantic schemas exactly ──────────────────

export interface UserOut {
  id: number;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export interface GeocodeCandidate {
  city: string;
  state: string;
  country_code: string;
  country_name: string;
  region: string | null;
  lat: number;
  lon: number;
  is_us: boolean;
  display_name: string;
  disambiguation_label: string;
  population: number;
}

export interface HazardWarning {
  type: string;
  hazards: string[];
  message: string;
}

export interface PredictResponse {
  scores: Record<string, number>;
  composite_score: number;
  raw_weather: Record<string, number>;
  warnings: HazardWarning[];
  is_us: boolean;
  snapshot_id: number | null;
}

// ── Auth ─────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (email: string, password: string, display_name?: string) =>
    request<Token>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }),

  login: (email: string, password: string) =>
    request<Token>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ── Predictions ──────────────────────────────────────────────────────────

export const predictionApi = {
  geocode: (query: string) =>
    request<GeocodeCandidate[]>("/geocode", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  predict: (candidate: GeocodeCandidate, saveSnapshot = true) =>
    request<PredictResponse>("/predict", {
      method: "POST",
      body: JSON.stringify({
        city: candidate.city,
        country_code: candidate.country_code,
        lat: candidate.lat,
        lon: candidate.lon,
        region: candidate.region,
        save_snapshot: saveSnapshot,
      }),
    }),
};

export { getToken };
