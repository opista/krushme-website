import { useRestaurant } from "@/context/restaurant-context";
import LeafletMap from "./leaflet-map";
import MarkersLayer from "./markers-layer";

export default function RestaurantMap() {
  const { restaurants } = useRestaurant();

  return (
    <LeafletMap>
      <MarkersLayer restaurants={restaurants} />
    </LeafletMap>
  );
}
