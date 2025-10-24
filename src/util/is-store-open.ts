import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";
import { getOpeningAndClosingTimes } from "./get-open-and-closing-times";
import { getRelativeDay } from "./get-relative-day";

export const isStoreOpen = (hours?: RestaurantOpenHours) => {
  const now = DateTime.now().setZone("Europe/London") as DateTime<true>;

  if (!now.weekdayLong) return null;

  const todaysHours = getOpeningAndClosingTimes(hours, now.weekdayLong);

  if (!todaysHours) return null;

  const { openingTime, closingTime } = todaysHours;

  // Check if we're within today's hours (including midnight crossover)
  if (closingTime.day !== openingTime.day) {
    // Store closes after midnight
    if (now >= openingTime && now < closingTime) {
      return true;
    }
  } else {
    // Normal case: same day opening and closing
    if (now >= openingTime && now < closingTime) {
      return true;
    }
  }

  // Check if we're in yesterday's extended hours (before today's opening)
  if (now < openingTime) {
    const yesterdayName = getRelativeDay(now.weekdayLong, -1);
    const yesterdaysHours = getOpeningAndClosingTimes(hours, yesterdayName);

    if (
      yesterdaysHours &&
      yesterdaysHours.closingTime.day !== yesterdaysHours.openingTime.day
    ) {
      // Yesterday had midnight crossover
      // The closing time returned is based on today's date, so it's actually tomorrow
      // We need to subtract a day to get the actual closing time
      const actualYesterdayClosingTime = yesterdaysHours.closingTime.minus({
        days: 1,
      });

      if (now < actualYesterdayClosingTime) {
        return true;
      }
    }
  }

  return false;
};
