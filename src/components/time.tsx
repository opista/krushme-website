"use client";

import { lastCheckedString } from "@/util/last-checked-string";
import { useCurrentTime } from "@/util/use-current-time";

type TimeProps = {
  lastChecked?: number;
};
export const Time = ({ lastChecked }: TimeProps) => {
  const now = useCurrentTime(1000);

  return (
    <span title={lastCheckedString(lastChecked)}>
      {now.toFormat("h:mm a")}
    </span>
  );
};
