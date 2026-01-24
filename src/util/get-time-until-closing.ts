import { OpenHours } from "@/types";
import { getOpeningAndClosingTimes } from "./get-open-and-closing-times";
import { DateTime } from "luxon";

/**
 * Calculates the time until closing for a store that is currently open.
 * Handles both normal hours and midnight crossover scenarios.
 */
export const getTimeUntilClosing = (
  hours: OpenHours,
  now: DateTime,
  todaysHours?: ReturnType<typeof getOpeningAndClosingTimes>,
  yesterdaysHoursFormatted?: ReturnType<typeof getOpeningAndClosingTimes>
): { timeUntilClosing: string; closingTime: DateTime } | null => {
  const todaysHoursFormatted =
    todaysHours !== undefined
      ? todaysHours
      : getOpeningAndClosingTimes(hours, now.weekdayLong, now);

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
    let yesterdaysHours = yesterdaysHoursFormatted;

    if (yesterdaysHours === undefined) {
      const yesterdayName = now.minus({ days: 1 }).weekdayLong;
      yesterdaysHours = getOpeningAndClosingTimes(hours, yesterdayName, now);
    }

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
const formatTimeUntilClosing = (diff: any): string => {
  // Round the duration to avoid decimal places
  const roundedDiff = diff.mapUnits((x: number) => Math.round(x));
  const human = roundedDiff.toHuman();
  // Clean up Luxon's output: remove commas and zero values
  const cleaned = human
    .replace(/,/g, "") // Remove commas
    .replace(/\b0 hours\b/g, "") // Remove "0 hours" (word boundary)
    .replace(/\b0 minutes\b/g, "") // Remove "0 minutes" (word boundary)
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();

  return `in ${cleaned}`;
};
