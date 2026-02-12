import { useRestaurant } from "@/context/restaurant-context";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const StatsControlImpl = leaflet.Control.extend({
  options: {
    position: "topright",
    percentage: 0,
  },
  onAdd: function () {
    const container = leaflet.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control bg-white"
    );
    const keyList = leaflet.DomUtil.create(
      "div",
      "p-2 font-bold leading-none",
      container
    );

    keyList.innerHTML = `${this.options.percentage}% Broken`;

    return container;
  },
  onRemove: function () {},
});

export default function StatsControl() {
  const map = useMap();
  const { stats } = useRestaurant();

  useEffect(() => {
    if (!stats?.total) return;

    const brokenPercentage = Number(
      ((stats.broken / stats.total) * 100).toFixed(2)
    );

    const control = new StatsControlImpl({
      percentage: brokenPercentage,
    } as leaflet.ControlOptions);
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map, stats]);

  return null;
}
