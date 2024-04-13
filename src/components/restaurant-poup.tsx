import { RestaurantData } from "@/types";
import { Popup } from "react-leaflet";
import OpenOrClosed from "./open-or-closed";
import timeSince from "@/util/time-since";
import KrushemStatus from "./krushem-status";

export default function RestaurantPopup({
  restaurant,
}: {
  restaurant: RestaurantData;
}) {
  return (
    <Popup maxWidth={235} minWidth={235}>
      <div className="font-bold">{restaurant.name}</div>
      <div title={restaurant.address} className="truncate text-ellipsis mb-2">
        {restaurant.address}
      </div>
      <div className="flex items-center">
        <span className="w-20">Dining In</span>{" "}
        <OpenOrClosed isOpen={restaurant.isOpenStandard} />
      </div>
      <div className="flex items-center">
        <span className="w-20">Collection</span>{" "}
        <OpenOrClosed isOpen={restaurant.isOpenCollection} />
      </div>
      <div className="flex items-center">
        <span className="w-20">Delivery</span>{" "}
        <OpenOrClosed isOpen={restaurant.isOpenDelivery} />
      </div>
      <div className="mb-2 flex items-center">
        <span className="w-20">Drive Thru</span>{" "}
        <OpenOrClosed isOpen={restaurant.isOpenDriveThru} />
      </div>
      <a className="inline-block mb-2" href={restaurant.link} target="_blank">
        Order online
      </a>
      <KrushemStatus status={restaurant.krushemMachineStatus} />
      <div className="mt-2 text-xs text-gray-400">
        Last checked {timeSince(new Date(restaurant.lastChecked))} ago
      </div>
    </Popup>
  );
}
