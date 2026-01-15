"use client";

import { useMap } from "react-leaflet";
import { RestaurantData } from "@/types";
import KrushemMarker from "./krushem-marker";
import setRadiusForZoom from "@/util/set-radius-for-zoom";

type Props = {
  restaurants: RestaurantData[];
};

export default function MarkersLayer({ restaurants }: Props) {
  const map = useMap();
  const radius = setRadiusForZoom(map.getZoom());

  return (
    <>
      {restaurants.map((restaurant) => (
        <KrushemMarker
          key={restaurant.id}
          restaurant={restaurant}
          radius={radius}
        />
      ))}
    </>
  );
}
