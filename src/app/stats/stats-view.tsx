"use client";

import { MachineStatsHistory } from "@/types";
import { useMemo, useState } from "react";
import MachineStatsChart from "./machine-stats-chart";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

type Range = 24 | 168 | 720;

export type ChartPoint = {
  broken: number | null;
  time: number;
  unknown: number | null;
  working: number | null;
};

const ranges: { label: string; value: Range }[] = [
  { label: "24 hours", value: 24 },
  { label: "7 days", value: 168 },
  { label: "30 days", value: 720 },
];

const colours = {
  broken: "#dc2626",
  unknown: "#6b7280",
  working: "#16a34a",
};

const formatDate = (timestamp: number, withTime = false) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(timestamp);

export default function StatsView({ data }: { data: MachineStatsHistory }) {
  const [range, setRange] = useState<Range>(720);
  const points = useMemo<ChartPoint[]>(() => {
    const start = data.start;
    if (start === null) return [];

    return data.points.map(([working, broken, unknown], index) => ({
      time: start + index * data.intervalSeconds * 1000,
      working,
      broken,
      unknown,
    }));
  }, [data]);
  const visiblePoints = points.slice(-range);
  const latest = [...points]
    .reverse()
    .find(
      (point) =>
        point.working !== null &&
        point.broken !== null &&
        point.unknown !== null
    );
  const total = latest
    ? latest.working! + latest.broken! + latest.unknown!
    : 0;
  const workingPercentage = total
    ? Math.round(((latest?.working || 0) / total) * 100)
    : 0;
  const brokenPercentage = total ? Math.round(((latest?.broken || 0) / total) * 100) : 0;
  const unknownPercentage = total ? Math.round(((latest?.unknown || 0) / total) * 100) : 0;

  return (
    <main className="min-h-svh bg-stone-50 text-stone-950">
      <SiteHeader />

      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">Machine stats</h2>
        <p className="max-w-2xl text-base leading-7 text-stone-600">
          A national snapshot of the KFC restaurants we check. Each point shows
          how many Krushem machines were working, broken, or could not be
          confirmed at that hour.
        </p>
        <a className="mt-5 inline-flex rounded-full border border-kfc px-4 py-2 text-sm font-bold text-kfc transition hover:bg-kfc hover:text-white" href="/">Back to map</a>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><div className="flex items-baseline justify-between gap-4"><div><h2 className="text-lg font-bold">Latest hourly snapshot</h2><p className="mt-1 text-sm text-stone-600">The most recent status check across the restaurants we monitor.</p></div><span className="text-sm font-semibold text-stone-500">{latest ? formatDate(latest.time, true) : "—"}</span></div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Working machines" value={latest?.working ?? "—"} percentage={workingPercentage} tone="working" />
          <StatCard label="Broken machines" value={latest?.broken ?? "—"} percentage={brokenPercentage} tone="broken" />
          <StatCard label="Unknown status" value={latest?.unknown ?? "—"} percentage={unknownPercentage} tone="unknown" />
        </div></div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Machines checked over time</h2>
              <p className="mt-1 text-sm text-stone-600">
                {visiblePoints.length
                  ? `${formatDate(visiblePoints[0].time, range === 24)} to ${formatDate(visiblePoints[visiblePoints.length - 1].time, range === 24)}`
                  : "No hourly snapshots are available yet."}
              </p>
            </div>
            <div
              aria-label="Chart range"
              className="flex w-fit rounded-lg bg-stone-100 p-1"
              role="group"
            >
              {ranges.map(({ label, value }) => (
                <button
                  aria-pressed={range === value}
                  className={`rounded-md px-3 py-1.5 text-sm font-bold transition ${
                    range === value
                      ? "bg-white text-kfc shadow-sm"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                  key={value}
                  onClick={() => setRange(value)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6" aria-label="Hourly Krushem machine status chart">
            {visiblePoints.length ? (
              <MachineStatsChart points={visiblePoints} />
            ) : (
              <p className="py-24 text-center text-sm text-stone-600">
                The history feed is not available yet.
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Legend colour={colours.working} label="Working" />
            <Legend colour={colours.broken} label="Broken" />
            <Legend colour={colours.unknown} label="Unknown" />
          </div>
        </div>

        <p className="mt-5 text-sm text-stone-500">
          Last published {data.updatedAt ? formatDate(new Date(data.updatedAt).getTime(), true) : "—"}.
          A missing point means no snapshot was recorded for that hour.
        </p>
      </section><SiteFooter />
    </main>
  );
}

function StatCard({
  label,
  tone,
  percentage,
  value,
}: {
  label: string;
  tone?: keyof typeof colours;
  percentage?: number;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-stone-600">{label}</p>
      <div className="mt-2 flex items-baseline gap-2"><p className="text-2xl font-bold" style={tone ? { color: colours[tone] } : undefined}>{typeof value === "number" ? value.toLocaleString("en-GB") : value}</p>{typeof value === "number" && percentage !== undefined ? <span className="text-sm font-semibold text-stone-600">{percentage}%</span> : null}</div>
    </div>
  );
}

function Legend({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: colour }}
      />
      {label}
    </span>
  );
}
