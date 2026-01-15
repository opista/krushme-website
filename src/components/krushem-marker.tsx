"use client";

import { memo } from "react";
import { CircleMarker } from "react-leaflet";
import { RestaurantData } from "@/types";
import RestaurantPopup from "./restaurant-popup";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";

type Props = {
  restaurant: RestaurantData;
  radius: number;
};

function KrushemMarker({ restaurant, radius }: Props) {
  const krushemMeta = mapKrushemStatusToMeta(restaurant.krushemMachineStatus);

  return (
    <CircleMarker
      center={[restaurant.coords.latitude, restaurant.coords.longitude]}
      color={krushemMeta.colorRgb}
      fillOpacity={1}
      radius={radius}
      stroke={false}
    >
      <RestaurantPopup restaurant={restaurant} />
    </CircleMarker>
  );
}

export default memo(KrushemMarker);
