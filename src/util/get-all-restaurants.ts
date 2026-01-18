import { MappedRestaurantData } from "@/types";

const GIST_URL = `https://gist.githubusercontent.com/metacurb/${process.env.GIST_ID}/raw`;

export const getAllRestaurants = async (): Promise<MappedRestaurantData> => {
  // Directly fetch from the raw URL, utilizing GitHub's CDN (cached for ~5 mins)
  // This saves an extra API call to fetch the commit hash and avoids rate limiting on the API.
  return fetch(`${GIST_URL}/restaurants.json`).then((res) => res.json());
};
