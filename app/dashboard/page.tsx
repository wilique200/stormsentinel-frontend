"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BrandHeader } from "@/components/BrandHeader";
import { LocationSearch } from "@/components/LocationSearch";
import { HazardCard } from "@/components/HazardCard";
import { ThreatBar } from "@/components/ThreatBar";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { useAuth } from "@/context/AuthContext";
import { predictionApi, GeocodeCandidate, PredictResponse, ApiError } from "@/lib/api";
import { HAZARDS, getThreatLevel } from "@/lib/hazards";

function DashboardContent() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useState<GeocodeCandidate | null>(null);

  const predictMutation = useMutation({
    mutationFn: (candidate: GeocodeCandidate) => predictionApi.predict(candidate),
  });

  function handleLocationSelected(candidate: GeocodeCandidate) {
    setLocation(candidate);
    predictMutation.mutate(candidate);
  }

  const result: PredictResponse | undefined = predictMutation.data;
  const compositeLevel = result ? getThreatLevel(result.composite_score) : null;

  const primaryDriver = result
    ? HAZARDS.reduce((max, h) => (result.scores[h.key] > result.scores[max.key] ? h : max), HAZARDS[0])
    : null;

  const regionWarning = result?.warnings.find((w) => w.type === "region_unvalidated");
  const wildfireWarning = result?.warnings.find((w) => w.type === "low_confidence_wildfire");

  return (
    <main className="min-h-screen bg-base-void pb-10">
      {/* Header */}
      <header className="border-b border-base-line px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <BrandHeader />
        <div className="flex items-center gap-3">
          <span className="font-body text-xs text-base-muted hidden sm:block">
            {user?.display_name || user?.email}
          </span>
          <button
            onClick={logout}
            className="font-display text-[11px] tracking-wide text-base-muted hover:text-white transition-colors border border-base-line rounded-md px-3 py-1.5"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 pt-6">
        {/* Search */}
        <LocationSearch onLocationSelected={handleLocationSelected} />

        {/* Loading */}
        {predictMutation.isPending && (
          <div className="mt-8 text-center">
            <p className="font-display text-sm text-base-muted tracking-widest animate-pulse">
              FETCHING WEATHER DATA AND RUNNING INFERENCE...
            </p>
          </div>
        )}

        {/* Error */}
        {predictMutation.isError && (
          <div className="mt-6 bg-hazard-heat/10 border border-hazard-heat/30 rounded-lg px-4 py-3">
            <p className="font-body text-sm text-hazard-heat">
              {predictMutation.error instanceof ApiError
                ? predictMutation.error.message
                : "Could not reach the server — try again shortly."}
            </p>
          </div>
        )}

        {/* Results */}
        {result && location && (
          <>
            <div className="mt-6 mb-2">
              <h1 className="font-display text-2xl font-bold tracking-wide">
                {location.city.toUpperCase()}, {location.is_us ? location.state : location.country_name}
              </h1>
            </div>

            {regionWarning && (
              <div className="bg-threat-moderate/10 border border-threat-moderate/30 rounded-lg px-4 py-3 mb-4">
                <p className="font-body text-xs text-threat-moderate leading-relaxed">
                  🌍 {regionWarning.message}
                </p>
              </div>
            )}
            {wildfireWarning && (
              <div className="bg-hazard-wildfire/10 border border-hazard-wildfire/30 rounded-lg px-4 py-3 mb-4">
                <p className="font-body text-xs text-hazard-wildfire leading-relaxed">
                  🔥 {wildfireWarning.message}
                </p>
              </div>
            )}

            {/* Composite threat panel */}
            <div className="bg-base-panel border border-base-line rounded-xl p-5 mb-5">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="font-display text-[9px] tracking-[0.25em] text-base-muted mb-1">
                    COMPOSITE THREAT INDEX
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="font-mono text-5xl font-bold"
                      style={{ color: compositeLevel?.colorHex, textShadow: `0 0 28px ${compositeLevel?.colorHex}55` }}
                    >
                      {result.composite_score}
                    </span>
                    <span className="font-mono text-sm text-base-muted">/100</span>
                  </div>
                </div>

                <div className="flex-1 min-w-[180px]">
                  <ThreatBar score={result.composite_score} />
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div
                    className="px-4 py-1.5 rounded-md text-center"
                    style={{ backgroundColor: `${compositeLevel?.colorHex}15`, border: `1px solid ${compositeLevel?.colorHex}40` }}
                  >
                    <div className="font-display text-base font-bold tracking-widest" style={{ color: compositeLevel?.colorHex }}>
                      {compositeLevel?.label}
                    </div>
                  </div>
                  {primaryDriver && (
                    <div className="font-display text-[9px] text-base-muted tracking-wide">
                      PRIMARY DRIVER: <span style={{ color: primaryDriver.colorHex }}>{primaryDriver.label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hazard cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {HAZARDS.map((h) => (
                <HazardCard
                  key={h.key}
                  hazard={h}
                  score={result.scores[h.key]}
                  warning={h.usOnly && !result.is_us ? regionWarning : undefined}
                />
              ))}
            </div>

            {/* Surface conditions */}
            <div className="mt-5 bg-base-panel border border-base-line rounded-lg px-5 py-3 flex flex-wrap gap-x-6 gap-y-2">
              <span className="font-display text-[9px] text-base-muted tracking-[0.2em] self-center">
                SURFACE CONDITIONS
              </span>
              {Object.entries(result.raw_weather).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="font-display text-[9px] text-base-muted tracking-wide">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span className="font-mono text-sm text-gray-300 font-bold">{value}</span>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <RecommendationsPanel scores={result.scores} isUs={result.is_us} />
          </>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
