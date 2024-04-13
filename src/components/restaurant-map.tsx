import { useRestaurant } from "@/context/restaurant-context";
import LeafletMap from "./leaflet-map";
import KrushemMarker from "./krushem-marker";

export default function RestaurantMap() {
  const { restaurants } = useRestaurant();

  return (
    <LeafletMap>
      {restaurants.map((restaurant) => (
        <KrushemMarker key={restaurant.id} restaurant={restaurant} />
      ))}
    </LeafletMap>
  );
}
