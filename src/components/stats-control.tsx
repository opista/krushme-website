import { useRestaurant } from "@/context/restaurant-context";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface StatsControlOptions extends leaflet.ControlOptions {
  percentage: number;
}

const StatsControlImpl = leaflet.Control.extend<
  // Mixin properties
  {
    options: StatsControlOptions;
    onAdd: (this: leaflet.Control & { options: StatsControlOptions }) => HTMLElement;
  },
  // Options type for constructor
  StatsControlOptions
>({
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
    });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map, stats]);

  return null;
}
