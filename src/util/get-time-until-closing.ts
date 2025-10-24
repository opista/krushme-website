import { RestaurantOpenHours } from "@/types";
import { getOpeningAndClosingTimes } from "./get-open-and-closing-times";
import { DateTime } from "luxon";

/**
 * Calculates the time until closing for a store that is currently open.
 * Handles both normal hours and midnight crossover scenarios.
 */
export const getTimeUntilClosing = (
  hours: RestaurantOpenHours,
  now: DateTime
): { timeUntilClosing: string; closingTime: DateTime } | null => {
  const todaysHoursFormatted = getOpeningAndClosingTimes(
    hours,
    now.weekdayLong
  );

  if (!todaysHoursFormatted) return null;

  // If we're in today's hours, calculate diff normally
  if (now >= todaysHoursFormatted.openingTime) {
    const diff = todaysHoursFormatted.closingTime.diff(now, [
      "hours",
      "minutes",
    ]);

    return {
      timeUntilClosing: formatTimeUntilClosing(diff),
      closingTime: todaysHoursFormatted.closingTime,
    };
  } else {
    // We're in yesterday's extended hours, need to get yesterday's closing time
    const yesterdayName = now.minus({ days: 1 }).weekdayLong;
    const yesterdaysHours = getOpeningAndClosingTimes(hours, yesterdayName);

    if (
      yesterdaysHours &&
      yesterdaysHours.closingTime.day !== yesterdaysHours.openingTime.day
    ) {
      // Yesterday had midnight crossover, calculate time until that closing time
      const actualYesterdayClosingTime = yesterdaysHours.closingTime.minus({
        days: 1,
      });
      const diff = actualYesterdayClosingTime.diff(now, ["hours", "minutes"]);

      return {
        timeUntilClosing: formatTimeUntilClosing(diff),
        closingTime: actualYesterdayClosingTime,
      };
    }
  }

  return null;
};

/**
 * Formats a duration into a human-friendly "time until" string using Luxon's built-in toHuman().
 * Examples: "in 46 minutes", "in 2 hours", "in 1 hour 30 minutes"
 */
const formatTimeUntilClosing = (diff: any): string =>
  `in ${diff.toHuman({ showZeros: false })}`;
