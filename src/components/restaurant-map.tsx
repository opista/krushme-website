"use client";

import { useRestaurant } from "@/context/restaurant-context";
import { useCurrentTime } from "@/util/use-current-time";
import mapKrushemStatusToMeta from "@/util/map-krushem-status-to-meta";
import storage, { getMapCenter } from "@/util/storage";
import type { FeatureCollection, Point } from "geojson";
import { useCallback, useMemo, useState } from "react";
import Map, {
  AttributionControl,
  GeolocateControl,
  Layer,
  NavigationControl,
  Source,
  type LayerProps,
  type MapLayerMouseEvent,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import MapKeyControl from "./map-key-control";
import RestaurantPopup from "./restaurant-popup";
import StatsControl from "./stats-control";

const CARTO_VOYAGER_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const RESTAURANT_SOURCE_ID = "restaurants";
const RESTAURANT_LAYER_ID = "restaurant-markers";

type RestaurantFeatureProperties = {
  color: string;
  restaurantId: string;
};

const restaurantLayer: LayerProps = {
  id: RESTAURANT_LAYER_ID,
  type: "circle",
  paint: {
    "circle-color": ["get", "color"],
    "circle-opacity": 1,
    "circle-radius": ["step", ["zoom"], 3, 8, 5, 11, 10, 13, 15],
    "circle-stroke-width": 0,
  },
};

export default function RestaurantMap() {
  const { restaurants } = useRestaurant();
  const [settings] = useState(() => storage.getSettings());
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [isHoveringRestaurant, setIsHoveringRestaurant] = useState(false);
  // Update time every minute to ensure store status (Open/Closed) is accurate
  // without triggering excessive re-renders (e.g., every second).
  const now = useCurrentTime(60000);
  const { latitude, longitude } = getMapCenter(settings.center);

  const restaurantData = useMemo<
    FeatureCollection<Point, RestaurantFeatureProperties>
  >(
    () => ({
      type: "FeatureCollection",
      features: restaurants.map((restaurant) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            restaurant.coords.longitude,
            restaurant.coords.latitude,
          ],
        },
        properties: {
          color: mapKrushemStatusToMeta(restaurant.krushemMachineStatus)
            .colorRgb,
          restaurantId: restaurant.id,
        },
      })),
    }),
    [restaurants]
  );

  const selectedRestaurant = useMemo(
    () =>
      restaurants.find(
        (restaurant) => restaurant.id === selectedRestaurantId
      ) ?? null,
    [restaurants, selectedRestaurantId]
  );

  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    const restaurantId = event.features?.[0]?.properties?.restaurantId;
    setSelectedRestaurantId(
      typeof restaurantId === "string" ? restaurantId : null
    );
  }, []);

  const saveView = useCallback((event: ViewStateChangeEvent) => {
    const { latitude, longitude, zoom } = event.viewState;
    storage.updateSettings({ center: [latitude, longitude], zoom });
  }, []);

  return (
    <div className="absolute inset-0 z-10">
      <Map
        initialViewState={{ latitude, longitude, zoom: settings.zoom }}
        mapStyle={CARTO_VOYAGER_STYLE_URL}
        workerUrl="/maplibre/maplibre-gl-worker.mjs"
        minZoom={5}
        maxZoom={18}
        interactiveLayerIds={[RESTAURANT_LAYER_ID]}
        onClick={handleMapClick}
        onMouseEnter={() => setIsHoveringRestaurant(true)}
        onMouseLeave={() => setIsHoveringRestaurant(false)}
        onMoveEnd={saveView}
        attributionControl={false}
        cursor={isHoveringRestaurant ? "pointer" : "grab"}
        reuseMaps
      >
        <NavigationControl position="top-left" showCompass={false} />
        <GeolocateControl
          position="top-left"
          fitBoundsOptions={{ maxZoom: 11 }}
          positionOptions={{ enableHighAccuracy: true }}
        />
        <AttributionControl position="bottom-right" />

        <Source id={RESTAURANT_SOURCE_ID} type="geojson" data={restaurantData}>
          <Layer {...restaurantLayer} />
        </Source>

        {selectedRestaurant && (
          <RestaurantPopup
            restaurant={selectedRestaurant}
            now={now}
            onClose={() => setSelectedRestaurantId(null)}
          />
        )}
      </Map>

      <div className="map-controls-right absolute top-[10px] z-20 flex flex-col items-end gap-[10px]">
        <StatsControl />
        <MapKeyControl />
      </div>
    </div>
  );
}
