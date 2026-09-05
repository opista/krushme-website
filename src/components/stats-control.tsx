import { useRestaurant } from "@/context/restaurant-context";

export default function StatsControl() {
  const { stats } = useRestaurant();

  if (!stats?.total) return null;

  const brokenPercentage = Number(
    ((stats.broken / stats.total) * 100).toFixed(2)
  );

  return (
    <div className="map-overlay-control bg-white p-2 text-xs font-bold leading-none">
      {brokenPercentage}% Broken
    </div>
  );
}
