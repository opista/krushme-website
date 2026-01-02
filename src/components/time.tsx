"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export const Time = () => {
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
    <>{DateTime.fromJSDate(date).setZone("Europe/London").toFormat("h:mm a")}</>
  );
};
