"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { predictionApi, GeocodeCandidate, ApiError } from "@/lib/api";

interface Props {
  onLocationSelected: (candidate: GeocodeCandidate) => void;
}

export function LocationSearch({ onLocationSelected }: Props) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<GeocodeCandidate[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const geocodeMutation = useMutation({
    mutationFn: (q: string) => predictionApi.geocode(q),
    onSuccess: (results) => {
      setErrorMsg(null);
      if (results.length === 1) {
        setCandidates([]);
        onLocationSelected(results[0]);
      } else {
        // Multiple matches (e.g. "Paris" -> Paris FR, Paris TX, Paris KY...)
        // — never auto-pick, always let the user choose, sorted by
        // population so the list is easy to scan.
        setCandidates(results);
      }
    },
    onError: (e) => {
      setCandidates([]);
      setErrorMsg(e instanceof ApiError ? e.message : "Search failed — try again");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    geocodeMutation.mutate(query.trim());
  }

  function pickCandidate(c: GeocodeCandidate) {
    setCandidates([]);
    setQuery("");
    onLocationSelected(c);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any city — e.g. Austin, TX or Nairobi, Kenya"
          className="flex-1 bg-black/30 border border-base-line rounded-lg px-3 py-2.5 font-body text-sm text-white placeholder:text-base-faint focus:outline-none focus:border-hazard-thunderstorm transition-colors"
        />
        <button
          type="submit"
          disabled={geocodeMutation.isPending}
          className="font-display text-sm font-semibold tracking-wide px-4 py-2.5 rounded-lg text-white disabled:opacity-50 transition-opacity"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)" }}
        >
          {geocodeMutation.isPending ? "..." : "🔍"}
        </button>
      </form>

      {errorMsg && (
        <p className="font-body text-xs text-hazard-heat mt-2">{errorMsg}</p>
      )}

      {candidates.length > 0 && (
        <div className="mt-3 bg-base-panel border border-base-line rounded-lg overflow-hidden">
          <div className="px-3 py-2 bg-threat-moderate/10 border-b border-base-line">
            <p className="font-display text-[11px] text-threat-moderate tracking-wide">
              📍 Found {candidates.length} places matching that name — which one?
            </p>
          </div>
          {candidates.map((c, i) => (
            <button
              key={i}
              onClick={() => pickCandidate(c)}
              className="w-full text-left px-3 py-2.5 font-body text-sm text-white hover:bg-white/5 transition-colors border-b border-base-line last:border-b-0"
            >
              {c.disambiguation_label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
