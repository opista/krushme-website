"use client";

import { memo } from "react";
import { CircleMarker } from "react-leaflet";
import { RestaurantData } from "@/types";
import RestaurantPopup from "./restaurant-popup";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";
import { DateTime } from "luxon";

type Props = {
  restaurant: RestaurantData;
  radius: number;
  now?: DateTime;
};

function KrushemMarker({ restaurant, radius, now }: Props) {
  const krushemMeta = mapKrushemStatusToMeta(restaurant.krushemMachineStatus);

  return (
    <CircleMarker
      center={[restaurant.coords.latitude, restaurant.coords.longitude]}
      color={krushemMeta.colorRgb}
      fillOpacity={1}
      radius={radius}
      stroke={false}
    >
      <RestaurantPopup restaurant={restaurant} now={now} />
    </CircleMarker>
  );
}

export default memo(KrushemMarker);
