import { OpenHoursDayOfWeek, RestaurantOpenHours } from "@/types";
import { DateObjectUnits, DateTime } from "luxon";

const convertHoursToTime = (num: number): DateObjectUnits => {
  return {
    hour: Math.floor(num / 100),
    minute: num % 100,
    second: 0,
    millisecond: 0,
  };
};

export const getOpeningAndClosingTimes = (
  openHours?: RestaurantOpenHours,
  dayOfWeek?: string | null
) => {
  const now = DateTime.now().setZone("Europe/London");

  if (!openHours) return null;

  const openHoursForDay = openHours[
    dayOfWeek?.toLowerCase() as keyof RestaurantOpenHours
  ] as OpenHoursDayOfWeek;

  if (!openHoursForDay) return null;

  const openingHours = convertHoursToTime(openHoursForDay.open);
  const closingHours = convertHoursToTime(openHoursForDay.close);

  const openingTime = now.set(openingHours);
  const potentialClosingTime = now.set(closingHours);

  // Special case: if close is 0 (midnight), treat it as end of day (24:00)
  if (openHoursForDay.close === 0) {
    return {
      openingTime,
      closingTime: openingTime.endOf("day"), // This gives us 23:59:59.999
    };
  }

  if (potentialClosingTime <= openingTime) {
    return {
      openingTime,
      closingTime: potentialClosingTime.plus({ days: 1 }),
    };
  }

  return {
    openingTime,
    closingTime: potentialClosingTime,
  };
};
