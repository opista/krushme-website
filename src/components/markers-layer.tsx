"use client";

import { useMap } from "react-leaflet";
import { RestaurantData } from "@/types";
import KrushemMarker from "./krushem-marker";
import setRadiusForZoom from "@/util/set-radius-for-zoom";
import { DateTime } from "luxon";

type Props = {
  restaurants: RestaurantData[];
  now?: DateTime;
};

export default function MarkersLayer({ restaurants, now }: Props) {
  const map = useMap();
  const radius = setRadiusForZoom(map.getZoom());

  return (
    <>
      {restaurants.map((restaurant) => (
        <KrushemMarker
          key={restaurant.id}
          restaurant={restaurant}
          radius={radius}
          now={now}
        />
      ))}
    </>
  );
}
