"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { locationsApi } from "@/lib/api";
import { HAZARDS } from "@/lib/hazards";

interface Props {
  locationId: number;
  cityLabel: string;
}

const COMPOSITE_COLOR = "#E5E7EB";

function formatTick(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function HistoryChart({ locationId, cityLabel }: Props) {
  const [visibleHazards, setVisibleHazards] = useState<Set<string>>(new Set());

  const historyQuery = useQuery({
    queryKey: ["locationHistory", locationId],
    queryFn: () => locationsApi.history(locationId),
  });

  const chartData = useMemo(() => {
    if (!historyQuery.data) return [];
    return historyQuery.data.map((point) => ({
      queried_at: point.queried_at,
      composite_score: point.composite_score,
      ...point.scores,
    }));
  }, [historyQuery.data]);

  function toggleHazard(key: string) {
    setVisibleHazards((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (historyQuery.isLoading) {
    return (
      <p className="font-body text-xs text-base-muted text-center py-6">
        Loading history...
      </p>
    );
  }

  if (chartData.length < 2) {
    return (
      <p className="font-body text-xs text-base-muted text-center py-6">
        Not enough history yet for {cityLabel} — check back after a couple more checks.
      </p>
    );
  }

  return (
    <div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#0e1929" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="queried_at"
              tickFormatter={formatTick}
              tick={{ fill: "#2e4156", fontSize: 10, fontFamily: "Space Mono, monospace" }}
              stroke="#0e1929"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#2e4156", fontSize: 10, fontFamily: "Space Mono, monospace" }}
              stroke="#0e1929"
              width={28}
            />
            <Tooltip
              labelFormatter={(v) => new Date(v as string).toLocaleString()}
              contentStyle={{
                backgroundColor: "#07090f",
                border: "1px solid #0e1929",
                borderRadius: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
              }}
              labelStyle={{ color: "#2e4156", marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="composite_score"
              name="Composite"
              stroke={COMPOSITE_COLOR}
              strokeWidth={2.5}
              dot={{ r: 3, fill: COMPOSITE_COLOR }}
              activeDot={{ r: 5 }}
            />
            {HAZARDS.filter((h) => visibleHazards.has(h.key)).map((h) => (
              <Line
                key={h.key}
                type="monotone"
                dataKey={h.key}
                name={h.label}
                stroke={h.colorHex}
                strokeWidth={1.5}
                dot={{ r: 2, fill: h.colorHex }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <span
          className="font-display text-[9px] font-bold tracking-wide px-2 py-1 rounded border"
          style={{ color: COMPOSITE_COLOR, borderColor: `${COMPOSITE_COLOR}40`, backgroundColor: `${COMPOSITE_COLOR}10` }}
        >
          COMPOSITE
        </span>
        {HAZARDS.map((h) => {
          const isOn = visibleHazards.has(h.key);
          return (
            <button
              key={h.key}
              onClick={() => toggleHazard(h.key)}
              className="font-display text-[9px] font-bold tracking-wide px-2 py-1 rounded border transition-opacity"
              style={{
                color: h.colorHex,
                borderColor: isOn ? `${h.colorHex}80` : "#0e1929",
                backgroundColor: isOn ? `${h.colorHex}18` : "transparent",
                opacity: isOn ? 1 : 0.5,
              }}
            >
              {h.icon} {h.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
