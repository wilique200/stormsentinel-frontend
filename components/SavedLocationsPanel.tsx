"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationsApi, SavedLocationWithLatest, PredictResponse, ApiError } from "@/lib/api";
import { getThreatLevel } from "@/lib/hazards";
import { HistoryChart } from "@/components/HistoryChart";

interface Props {
  onResult: (params: { city: string; country: string; lat: number; lon: number; result: PredictResponse }) => void;
}

export function SavedLocationsPanel({ onResult }: Props) {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const locationsQuery = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationsApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => locationsApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      if (expandedId === id) setExpandedId(null);
    },
  });

  const checkMutation = useMutation({
    mutationFn: (location: SavedLocationWithLatest) => locationsApi.predict(location.id),
    onSuccess: (result, location) => {
      onResult({ city: location.city, country: location.country, lat: location.lat, lon: location.lon, result });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["locationHistory", location.id] });
    },
  });

  const locations = locationsQuery.data || [];

  if (locationsQuery.isLoading) return null;
  if (locations.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="font-display text-[9px] tracking-[0.25em] text-base-muted mb-2.5">
        SAVED LOCATIONS
      </div>
      <div className="flex flex-col gap-2.5">
        {locations.map((loc) => {
          const level = loc.latest_composite_score !== null ? getThreatLevel(loc.latest_composite_score) : null;
          const isChecking = checkMutation.isPending && checkMutation.variables?.id === loc.id;
          const isExpanded = expandedId === loc.id;

          return (
            <div key={loc.id} className="bg-base-card border border-base-line rounded-lg overflow-hidden">
              <div className="px-3.5 py-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => checkMutation.mutate(loc)}
                  disabled={isChecking}
                  className="text-left flex-1 min-w-0 disabled:opacity-60"
                >
                  <div className="font-display text-[13px] font-bold tracking-wide truncate">
                    {loc.city.toUpperCase()}, {loc.country}
                  </div>
                  <div className="font-body text-[10.5px] text-base-muted mt-0.5">
                    {isChecking
                      ? "Checking..."
                      : loc.latest_composite_score !== null
                      ? `Composite ${loc.latest_composite_score}/100`
                      : "Not checked yet"}
                  </div>
                </button>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {level && (
                    <span
                      className="font-display text-[9px] font-bold tracking-wide px-2 py-0.5 rounded"
                      style={{ color: level.colorHex, backgroundColor: `${level.colorHex}18` }}
                    >
                      {level.label}
                    </span>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : loc.id)}
                    className={`font-display text-[10px] transition-colors ${
                      isExpanded ? "text-hazard-thunderstorm" : "text-base-muted hover:text-white"
                    }`}
                    aria-label={`Toggle history for ${loc.city}`}
                    title="View history"
                  >
                    📈
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(loc.id)}
                    className="font-display text-[10px] text-base-muted hover:text-hazard-heat transition-colors"
                    aria-label={`Remove ${loc.city}`}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-base-line px-3.5 py-3">
                  <HistoryChart locationId={loc.id} cityLabel={loc.city} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checkMutation.isError && (
        <p className="font-body text-xs text-hazard-heat mt-2">
          {checkMutation.error instanceof ApiError ? checkMutation.error.message : "Couldn't check that location — try again."}
        </p>
      )}
    </div>
  );
}
