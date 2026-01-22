import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export function useCurrentTime(refreshIntervalMs: number = 60000) {
  const [now, setNow] = useState(() => DateTime.now().setZone("Europe/London"));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now().setZone("Europe/London"));
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  return now;
}
