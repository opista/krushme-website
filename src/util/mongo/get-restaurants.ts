import {
  KrushemMachineStatus,
  MappedRestaurantData,
  RestaurantStoreModel,
} from "@/types";
import { mapRestaurant } from "../map-restaurant";
import clientPromise from "./client";

export const getAllRestaurants = async (): Promise<MappedRestaurantData> => {
  const client = await clientPromise;
  const db = client.db("krushme");
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
