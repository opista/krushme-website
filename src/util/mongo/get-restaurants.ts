import {
  KrushemMachineStatus,
  MappedRestaurantData,
  RestaurantStoreModel,
} from "@/types";
import { Db } from "mongodb";
import { mapRestaurant } from "../map-restaurant";

export const getAllRestaurants = async (
  db: Db
): Promise<MappedRestaurantData> => {
  const collection = db.collection<RestaurantStoreModel>("restaurants");

  const restaurants = await collection.find().toArray();

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
