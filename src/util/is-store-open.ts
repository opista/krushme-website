import { OpenHours } from "@/types";
import { DateTime } from "luxon";
import { getOpeningAndClosingTimes } from "./get-open-and-closing-times";
import { getRelativeDay } from "./get-relative-day";

export const isStoreOpen = (
  hours?: OpenHours,
  now: DateTime = DateTime.now().setZone("Europe/London"),
  todaysHoursFormatted?: ReturnType<typeof getOpeningAndClosingTimes>,
  yesterdaysHoursFormatted?: ReturnType<typeof getOpeningAndClosingTimes>
) => {
  if (!now.weekdayLong) return null;

  const todaysHours =
    todaysHoursFormatted !== undefined
      ? todaysHoursFormatted
      : getOpeningAndClosingTimes(hours, now.weekdayLong, now);

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
    let yesterdaysHours = yesterdaysHoursFormatted;

    if (yesterdaysHours === undefined) {
      const yesterdayName = getRelativeDay(now.weekdayLong, -1);
      yesterdaysHours = getOpeningAndClosingTimes(hours, yesterdayName, now);
    }

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
