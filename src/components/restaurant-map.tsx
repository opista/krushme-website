import { useRestaurant } from "@/context/restaurant-context";
import LeafletMap from "./leaflet-map";
import MarkersLayer from "./markers-layer";
import { useCurrentTime } from "@/util/use-current-time";

type RestaurantMapProps = {
  cartoApiKey?: string;
};

export default function RestaurantMap({ cartoApiKey }: RestaurantMapProps) {
  const { restaurants } = useRestaurant();
  // Update time every minute to ensure store status (Open/Closed) is accurate
  // without triggering excessive re-renders (e.g., every second).
  const now = useCurrentTime(60000);

  return (
    <LeafletMap cartoApiKey={cartoApiKey}>
      <MarkersLayer restaurants={restaurants} now={now} />
    </LeafletMap>
  );
}
