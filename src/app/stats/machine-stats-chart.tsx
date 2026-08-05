"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartPoint } from "./stats-view";

const hoverLine = { id: "hoverLine", afterDraw(chart: ChartJS) { const active = chart.tooltip?.getActiveElements(); if (!active?.length) return; const x = active[0].element.x; const { ctx, chartArea } = chart; ctx.save(); ctx.strokeStyle = "#78716c"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x, chartArea.top); ctx.lineTo(x, chartArea.bottom); ctx.stroke(); ctx.restore(); } };
ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip, hoverLine);

const colours = { broken: "#dc2626", unknown: "#6b7280", working: "#16a34a" };

export default function MachineStatsChart({ points }: { points: ChartPoint[] }) {
  return (
    <div className="h-72 sm:h-80">
      <Line
        data={{
          labels: points.map((point) => new Date(point.time).toLocaleString("en-GB", { day: "numeric", hour: "2-digit", minute: "2-digit", month: "long", year: "numeric" })),
          datasets: [
            { label: "Working", data: points.map((point) => point.working), borderColor: colours.working, backgroundColor: "rgba(22, 163, 74, 0.1)", pointRadius: 0, tension: 0.2 },
            { label: "Broken", data: points.map((point) => point.broken), borderColor: colours.broken, backgroundColor: "rgba(220, 38, 38, 0.1)", pointRadius: 0, tension: 0.2 },
            { label: "Unknown", data: points.map((point) => point.unknown), borderColor: colours.unknown, pointRadius: 0, tension: 0.2 },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: "index" },
          plugins: { legend: { display: false }, tooltip: { displayColors: true, callbacks: { label: (context) => { const values = context.chart.data.datasets.map((dataset) => Number(dataset.data[context.dataIndex] ?? 0)); const total = values.reduce((sum, value) => sum + value, 0); const value = Number(context.raw ?? 0); const percentage = total ? Math.round((value / total) * 100) : 0; return `${context.dataset.label}: ${value.toLocaleString("en-GB")} (${percentage}%)`; } } } },
          scales: {
            x: { grid: { display: false }, ticks: { autoSkip: true, callback: (_value, index) => new Date(points[index].time).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), maxRotation: 45, minRotation: 45 } },
            y: { beginAtZero: true, grid: { color: "#e7e5e4" }, ticks: { precision: 0 } },
          },
        }}
      />
    </div>
  );
}
