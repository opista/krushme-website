import { useRestaurant } from "@/context/restaurant-context";
import leaflet from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function StatsControl() {
  const map = useMap();
  const { stats } = useRestaurant();

  useEffect(() => {
    if (!stats?.total) return;

    const brokenPercentage = Number(
      ((stats.broken / stats.total) * 100).toFixed(2)
    );

    const StatsControl = leaflet.Control.extend({
      options: {
        position: "topright",
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

        keyList.innerHTML = `${brokenPercentage}% Broken`;

        return container;
      },
      onRemove: function () {},
    });

    const control = new StatsControl();
    map.addControl(control);
  }, [stats]);

  return null;
}
