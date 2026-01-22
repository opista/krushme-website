"use client";

import { lastCheckedString } from "@/util/last-checked-string";
import { useCurrentTime } from "@/util/use-current-time";
import { useEffect, useState } from "react";

type TimeProps = {
  lastChecked?: number;
};
export const Time = ({ lastChecked }: TimeProps) => {
  // Update every second to keep the clock ticking accurately
  const now = useCurrentTime(1000);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="w-20" />;
  }

  return (
    <span title={lastCheckedString(lastChecked)}>
      {now.toFormat("h:mm a")}
    </span>
  );
};
