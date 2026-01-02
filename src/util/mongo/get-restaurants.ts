import {
  KrushemMachineStatus,
  MappedRestaurantData,
  ProjectedRestaurantStoreModel,
  RestaurantStoreModel,
} from "@/types";
import { Db } from "mongodb";
import { mapRestaurant } from "../map-restaurant";

export const getAllRestaurants = async (
  db: Db
): Promise<MappedRestaurantData> => {
  const collection = db.collection<RestaurantStoreModel>("restaurants");

  const restaurants = await collection
    .find()
    .project<ProjectedRestaurantStoreModel>({
      _id: 1,
      checkedAt: 1,
      krushemMachineStatus: 1,
      "meta.geolocation": 1,
      "meta.hours": 1,
      "meta.link": 1,
      "meta.name": 1,
      "meta.street": 1,
      "meta.city": 1,
      "meta.postalcode": 1,
    })
    .toArray();

  const locations = restaurants.map(mapRestaurant);

  const stats = locations.reduce(
    (acc, { krushemMachineStatus = KrushemMachineStatus.Unknown }) => ({
      ...acc,
      [krushemMachineStatus]: acc[krushemMachineStatus] + 1,
    }),
    { unknown: 0, broken: 0, working: 0, total: locations.length }
  );

  return {
    locations,
    stats,
  };
};
