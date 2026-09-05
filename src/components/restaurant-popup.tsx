import { RestaurantData } from "@/types";
import { Popup } from "react-map-gl/maplibre";
import OpenOrClosed from "./open-or-closed";
import KrushemStatus from "./krushem-status";
import { lastCheckedString } from "@/util/last-checked-string";
import { DateTime } from "luxon";
import { memo } from "react";

function RestaurantPopup({
  restaurant,
  now,
  onClose,
}: {
  restaurant: RestaurantData;
  now?: DateTime;
  onClose: () => void;
}) {
  return (
    <Popup
      longitude={restaurant.coords.longitude}
      latitude={restaurant.coords.latitude}
      maxWidth="255px"
      closeOnClick={false}
      className="restaurant-popup"
      onClose={onClose}
    >
      <div className="w-[235px]">
        <div className="pr-7 font-bold">{restaurant.name}</div>
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
        <a
          className="inline-block mb-2"
          href={restaurant.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Order online
        </a>
        <KrushemStatus status={restaurant.krushemMachineStatus} />
        <div className="mt-2 text-xs text-gray-400">
          {lastCheckedString(restaurant.lastChecked)}
        </div>
      </div>
    </Popup>
  );
}

export default memo(RestaurantPopup);
