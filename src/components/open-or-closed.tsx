"use client";

import { OpenHours } from "@/types";
import { getStoreStatus } from "@/util/get-store-status";

export default function OpenOrClosed({
  hours,
  orderMode,
}: {
  hours: OpenHours[];
  orderMode: string;
}) {
  const openHoursForMode = hours.find(
    ({ type }) => type.toLowerCase() === orderMode.toLowerCase()
  );

  const status = getStoreStatus(openHoursForMode);

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
