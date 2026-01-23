import { OpenHours } from "@/types";
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
  hours: OpenHours,
  todaysHoursFormatted: ReturnType<typeof getOpeningAndClosingTimes>
): string => {
  if (!now.weekdayLong) return "";

  if (todaysHoursFormatted) {
    // If we're before today's opening time, show today's opening time without day name
    if (now < todaysHoursFormatted.openingTime) {
      return `Re-opens at ${todaysHoursFormatted.openingTime.toFormat(
        "h:mm a"
      )}`;
    }
    // If we're after today's closing time, we need to find the next open day
  }

  // Find the next open day (either because today is not open, or we're past today's closing)
  const nextOpenDay = getNextOpenDay(now.weekdayLong, hours);
  const nextOpenDayHoursFormatted = getOpeningAndClosingTimes(
    hours,
    nextOpenDay,
    now
  );

  if (!nextOpenDay || !nextOpenDayHoursFormatted) return "";

  return `Re-opens at ${nextOpenDayHoursFormatted.openingTime.toFormat(
    "h:mm a"
  )} on ${capitaliseFirstLetter(nextOpenDay)}`;
};

export const getStoreStatus = (
  hours?: OpenHours,
  now: DateTime = DateTime.now().setZone("Europe/London")
): StoreStatus => {
  const todaysHoursFormatted = getOpeningAndClosingTimes(
    hours,
    now.weekdayLong,
    now
  );

  const isOpen = isStoreOpen(hours, now, todaysHoursFormatted);

  if (!hours || !now.weekdayLong) {
    return {
      color: "text-gray-500",
      label: "",
      text: "Unavailable",
    };
  }

  // If isOpen is null, it means today is not an open day (store is closed)
  if (isOpen === null) {
    return {
      color: "text-red-600",
      label: createLabelForNextOpenDay(now, hours, todaysHoursFormatted),
      text: "Closed",
    };
  }

  if (isOpen) {
    const timeInfo = getTimeUntilClosing(hours, now, todaysHoursFormatted);

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
    label: createLabelForNextOpenDay(now, hours, todaysHoursFormatted),
    text: "Closed",
  };
};
