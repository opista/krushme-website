import {
  KrushemMachineStatus,
  ProjectedRestaurantStoreModel,
  RestaurantData,
} from "@/types";
import { formatAddress } from "./format-address";

export const mapRestaurant = ({
  _id,
  checkedAt,
  krushemMachineStatus,
  meta,
}: ProjectedRestaurantStoreModel): RestaurantData => {
  const { geolocation, hours, link, name } = meta;

  return {
    id: _id?.toString() || "",
    address: formatAddress(meta),
    coords: geolocation,
    krushemMachineStatus: krushemMachineStatus || KrushemMachineStatus.Unknown,
    lastChecked: checkedAt,
    link: `https://www.kfc.co.uk${link}`,
    hours,
    name,
  };
};
