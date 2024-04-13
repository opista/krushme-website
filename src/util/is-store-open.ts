import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";
import { getOpeningAndClosingTimes } from "./get-open-and-closing-times";
import { getRelativeDay } from "./get-relative-day";

export const isStoreOpen = (hours?: RestaurantOpenHours) => {
  const now = DateTime.now().setZone("Europe/London");

  if (!now.weekdayLong) return null;

  const yesterday = getOpeningAndClosingTimes(
    hours,
    getRelativeDay(now.weekdayLong, -1)
  );

  const today = getOpeningAndClosingTimes(hours, now.weekdayLong);

  if (!today || !yesterday) return null;

  return (
    (yesterday.closingTime <= yesterday.openingTime &&
      yesterday.closingTime > now) ||
    (today.openingTime <= now && today.closingTime > now)
  );
};
