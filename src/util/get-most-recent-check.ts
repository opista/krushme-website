import { RestaurantData } from "@/types";

export function getMostRecentCheck(locations: RestaurantData[] = []): number | undefined {
  if (!locations.length) {
    return undefined;
  }

  let mostRecent = 0;

  for (const location of locations) {
    const current = location.lastChecked || 0;
    if (current > mostRecent) {
      mostRecent = current;
    }
  }

  return mostRecent || undefined;
}
