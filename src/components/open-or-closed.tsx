"use client";

import { OpenHours } from "@/types";
import { getStoreStatus } from "@/util/get-store-status";
import { DateTime } from "luxon";

export default function OpenOrClosed({
  hours,
  orderMode,
  now,
}: {
  hours: OpenHours[];
  orderMode: string;
  now?: DateTime;
}) {
  const openHoursForMode = hours.find(
    ({ type }) => type.toLowerCase() === orderMode.toLowerCase()
  );

  const status = getStoreStatus(openHoursForMode, now);

  return (
    <span
      suppressHydrationWarning
      title={status.label}
      className={`font-bold ${status.color}`}
    >
      {status.text}
    </span>
  );
}
