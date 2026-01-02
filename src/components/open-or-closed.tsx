"use client";

import { OpenHours } from "@/types";
import { getStoreStatus } from "@/util/get-store-status";
import { useEffect, useState } from "react";

export default function OpenOrClosed({
  hours,
  orderMode,
}: {
  hours: OpenHours[];
  orderMode: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<{
    color: string;
    label: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    const openHoursForMode = hours.find(
      ({ type }) => type.toLowerCase() === orderMode.toLowerCase()
    );
    setStatus(getStoreStatus(openHoursForMode));
  }, [hours, orderMode]);

  if (!mounted || !status) {
    return <span className="font-bold text-gray-500">Loading...</span>;
  }

  return (
    <span title={status.label} className={`font-bold ${status.color}`}>
      {status.text}
    </span>
  );
}
