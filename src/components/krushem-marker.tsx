"use client";

import { memo, useMemo, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const krushemMeta = mapKrushemStatusToMeta(restaurant.krushemMachineStatus);

  const eventHandlers = useMemo(
    () => ({
      popupopen: () => setIsOpen(true),
      popupclose: () => setIsOpen(false),
    }),
    []
  );

  return (
    <CircleMarker
      center={[restaurant.coords.latitude, restaurant.coords.longitude]}
      color={krushemMeta.colorRgb}
      fillOpacity={1}
      radius={radius}
      stroke={false}
      eventHandlers={eventHandlers}
    >
      <RestaurantPopup restaurant={restaurant} now={now} isOpen={isOpen} />
    </CircleMarker>
  );
}

export default memo(KrushemMarker);
