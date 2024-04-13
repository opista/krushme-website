"use client";

import { CircleMarker, useMap } from "react-leaflet";
import { RestaurantData } from "@/types";
import RestaurantPopup from "./restaurant-popup";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";
import setRadiusForZoom from "@/util/set-radius-for-zoom";

type Props = {
  restaurant: RestaurantData;
};

export default function KrushemMarker({ restaurant }: Props) {
  const krushemMeta = mapKrushemStatusToMeta(restaurant.krushemMachineStatus);
  const map = useMap();

  const radius = setRadiusForZoom(map.getZoom());

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
