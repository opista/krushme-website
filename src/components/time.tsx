"use client";

import { lastCheckedString } from "@/util/last-checked-string";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

type TimeProps = {
  lastChecked?: number;
};
export const Time = ({ lastChecked }: TimeProps) => {
  const [date, setDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !date) {
    return <span className="w-20" />;
  }

  return (
    <span title={lastCheckedString(lastChecked)}>
      {DateTime.fromJSDate(date).setZone("Europe/London").toFormat("h:mm a")}
    </span>
  );
};
