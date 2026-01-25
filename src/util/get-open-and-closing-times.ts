import { OpenHoursDayOfWeek, OpenHours } from "@/types";
import { DateObjectUnits, DateTime } from "luxon";

// Cache to store calculated times based on OpenHours reference + day/date key
// This avoids redundant Luxon DateTime creations which are expensive.
// WeakMap allows OpenHours objects to be garbage collected.
const cache = new WeakMap<
  OpenHours,
  Map<string, { openingTime: DateTime; closingTime: DateTime }>
>();

const convertHoursToTime = (num: number): DateObjectUnits => {
  return {
    hour: Math.floor(num / 100),
    minute: num % 100,
    second: 0,
    millisecond: 0,
  };
};

export const getOpeningAndClosingTimes = (
  openHours?: OpenHours,
  dayOfWeek?: string | null,
  now: DateTime = DateTime.now().setZone("Europe/London")
) => {
  if (!openHours) return null;

  // Memoization Check
  // We utilize the fact that for a given store (OpenHours ref) and a given day (date + weekday),
  // the opening/closing times are constant. 'now' changes every minute, but we only need its Date part.
  // Note: convertHoursToTime ensures seconds and milliseconds are 0, so 'now' time precision doesn't affect the result.
  const dateKey = now.toISODate();
  const cacheKey =
    dayOfWeek && dateKey ? `${dayOfWeek.toLowerCase()}|${dateKey}` : null;

  let dayCache:
    | Map<string, { openingTime: DateTime; closingTime: DateTime }>
    | undefined;

  if (cacheKey) {
    dayCache = cache.get(openHours);
    if (!dayCache) {
      dayCache = new Map();
      cache.set(openHours, dayCache);
    } else {
      const cached = dayCache.get(cacheKey);
      if (cached) return cached;
    }
  }

  const openHoursForDay = openHours[
    dayOfWeek?.toLowerCase() as keyof OpenHours
  ] as OpenHoursDayOfWeek;

  if (!openHoursForDay) return null;

  const openingHours = convertHoursToTime(openHoursForDay.open);
  const closingHours = convertHoursToTime(openHoursForDay.close);

  const openingTime = now.set(openingHours);
  const potentialClosingTime = now.set(closingHours);

  let result;

  // Special case: if close is 0 (midnight), treat it as end of day (24:00)
  if (openHoursForDay.close === 0) {
    result = {
      openingTime,
      closingTime: openingTime.endOf("day"), // This gives us 23:59:59.999
    };
  } else if (potentialClosingTime <= openingTime) {
    result = {
      openingTime,
      closingTime: potentialClosingTime.plus({ days: 1 }),
    };
  } else {
    result = {
      openingTime,
      closingTime: potentialClosingTime,
    };
  }

  // Store in cache
  if (cacheKey && dayCache) {
    dayCache.set(cacheKey, result);
  }

  return result;
};
