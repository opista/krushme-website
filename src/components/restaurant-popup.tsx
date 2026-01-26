import { RestaurantData } from "@/types";
import { Popup } from "react-leaflet";
import OpenOrClosed from "./open-or-closed";
import KrushemStatus from "./krushem-status";
import { lastCheckedString } from "@/util/last-checked-string";
import { DateTime } from "luxon";
import { memo } from "react";

function RestaurantPopup({
  restaurant,
  now,
  isPopupOpen,
}: {
  restaurant: RestaurantData;
  now?: DateTime;
  isPopupOpen?: boolean;
}) {
  return (
    <Popup maxWidth={235} minWidth={235}>
      <div className="font-bold">{restaurant.name}</div>
      <div title={restaurant.address} className="truncate text-ellipsis mb-2">
        {restaurant.address}
      </div>
      <div className="flex items-center">
        <span className="w-20">Dining In</span>{" "}
        <OpenOrClosed
          hours={restaurant.hours}
          orderMode="standard"
          now={now}
        />
      </div>
      <div className="flex items-center">
        <span className="w-20">Collection</span>{" "}
        <OpenOrClosed
          hours={restaurant.hours}
          orderMode="collect"
          now={now}
        />
      </div>
      <div className="flex items-center">
        <span className="w-20">Delivery</span>{" "}
        <OpenOrClosed
          hours={restaurant.hours}
          orderMode="delivery"
          now={now}
        />
      </div>
      <div className="mb-2 flex items-center">
        <span className="w-20">Drive Thru</span>{" "}
        <OpenOrClosed
          hours={restaurant.hours}
          orderMode="drivethru"
          now={now}
        />
      </div>
      <a className="inline-block mb-2" href={restaurant.link} target="_blank">
        Order online
      </a>
      <KrushemStatus status={restaurant.krushemMachineStatus} />
      <div className="mt-2 text-xs text-gray-400">
        {lastCheckedString(restaurant.lastChecked)}
      </div>
    </Popup>
  );
}

export default memo(RestaurantPopup, (prev, next) => {
  // Always re-render if restaurant object reference changes
  if (prev.restaurant !== next.restaurant) return false;

  // Always re-render if popup open state changes
  if (prev.isPopupOpen !== next.isPopupOpen) return false;

  // If both are closed, skip re-render even if 'now' changes
  // Treat undefined as true (safe fallback) to ensure we don't break existing usage if any
  const prevOpen = prev.isPopupOpen ?? true;
  const nextOpen = next.isPopupOpen ?? true;

  if (!prevOpen && !nextOpen) return true;

  // If open, check if 'now' changed
  return prev.now === next.now;
});
