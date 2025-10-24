import { RestaurantOpenHours } from "@/types";
import { capitaliseFirstLetter } from "@/util/capitalise-first-letter";
import { getNextOpenDay } from "@/util/get-next-open-day";
import { getOpeningAndClosingTimes } from "@/util/get-open-and-closing-times";
import { getTimeUntilClosing } from "@/util/get-time-until-closing";
import { isStoreOpen } from "@/util/is-store-open";
import { DateTime } from "luxon";

export interface StoreStatus {
  color: string;
  label: string;
  text: string;
}

const createLabelForNextOpenDay = (
  now: DateTime,
  hours: RestaurantOpenHours
): string => {
  if (!now.weekdayLong) return "";

  // First check if today is an open day
  const todaysHoursFormatted = getOpeningAndClosingTimes(
    hours,
    now.weekdayLong
  );

  if (todaysHoursFormatted) {
    // Today is an open day, show today's opening time without day name
    return `Re-opens at ${todaysHoursFormatted.openingTime.toFormat("h:mm a")}`;
  }

  // Today is not open, find the next open day
  const nextOpenDay = getNextOpenDay(now.weekdayLong, hours);
  const nextOpenDayHoursFormatted = getOpeningAndClosingTimes(
    hours,
    nextOpenDay
  );

  if (!nextOpenDay || !nextOpenDayHoursFormatted) return "";

  return `Re-opens at ${nextOpenDayHoursFormatted.openingTime.toFormat(
    "h:mm a"
  )} on ${capitaliseFirstLetter(nextOpenDay)}`;
};

export const getStoreStatus = (hours?: RestaurantOpenHours): StoreStatus => {
  const now = DateTime.now().setZone("Europe/London");

  const todaysHoursFormatted = getOpeningAndClosingTimes(
    hours,
    now.weekdayLong
  );

  const isOpen = isStoreOpen(hours);

  if (!hours || !now.weekdayLong || !todaysHoursFormatted || isOpen === null) {
    return {
      color: "text-gray-500",
      label: "",
      text: "Unavailable",
    };
  }

  if (isOpen) {
    const timeInfo = getTimeUntilClosing(hours, now);

    if (timeInfo) {
      return {
        color: "text-green-600",
        label: `Closes ${timeInfo.timeUntilClosing}`,
        text: `Open until ${timeInfo.closingTime.toFormat("h:mm a")}`,
      };
    }
  }

  return {
    color: "text-red-600",
    label: createLabelForNextOpenDay(now, hours),
    text: "Closed",
  };
};
