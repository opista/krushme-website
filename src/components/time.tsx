"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export const Time = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {DateTime.fromJSDate(date).setZone("Europe/London").toFormat("HH:mm:ss")}
    </>
  );
};
