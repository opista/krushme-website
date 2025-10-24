import { RestaurantOpenHours } from "@/types";
import { capitaliseFirstLetter } from "@/util/capitalise-first-letter";
import { getNextOpenDay } from "@/util/get-next-open-day";
import { getOpeningAndClosingTimes } from "@/util/get-open-and-closing-times";
import { getTimeUntilClosing } from "@/util/get-time-until-closing";
import { isStoreOpen } from "@/util/is-store-open";
import { DateTime } from "luxon";

const createLabelForNextOpenDay = (
  now: DateTime,
  hours: RestaurantOpenHours
) => {
  if (!now.weekdayLong) return "";

  // First check if today is an open day
  const todaysHoursFormatted = getOpeningAndClosingTimes(
    hours,
    now.weekdayLong
  );

  if (todaysHoursFormatted) {
    // Today is an open day, show today's opening time
    return `Re-opens at ${todaysHoursFormatted.openingTime.toFormat(
      "h:mm a"
    )} on ${capitaliseFirstLetter(now.weekdayLong)}`;
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

const getMetaForStatus = (hours?: RestaurantOpenHours) => {
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

export default function OpenOrClosed({
  hours,
  orderMode,
}: {
  hours: RestaurantOpenHours[];
  orderMode: string;
}) {
  const openHoursForMode = hours.find(
    ({ type }) => type.toLowerCase() === orderMode.toLowerCase()
  );

  const { color, label, text } = getMetaForStatus(openHoursForMode);

  return (
    <span title={label} className={`font-bold ${color}`}>
      {text}
    </span>
  );
}
