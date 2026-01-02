import { MappedRestaurantData } from "@/types";

export const getAllRestaurants = async (): Promise<MappedRestaurantData> => {
  return fetch(process.env.KRUSHME_API_URL!).then((res) => res.json());
};
