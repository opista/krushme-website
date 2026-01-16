import { RestaurantData } from "@/types";

/**
 * Returns the most recent lastChecked timestamp from an array of restaurants.
 * Uses a single O(N) pass and avoids creating Date objects for comparison.
 */
export function getMostRecentCheck(locations: RestaurantData[] = []): number | undefined {
  if (!locations.length) {
    return undefined;
  }

  let mostRecent = locations[0].lastChecked;

  for (let i = 1; i < locations.length; i++) {
    const current = locations[i].lastChecked;
    // Handle cases where lastChecked might be undefined
    if (current !== undefined) {
      if (mostRecent === undefined || current > mostRecent) {
        mostRecent = current;
      }
    }
  }

  return mostRecent;
}
