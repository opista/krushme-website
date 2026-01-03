import timeSince from "./time-since";

export const lastCheckedString = (lastChecked?: Date) => {
  if (!lastChecked) return "Never checked";
  return `Last checked ${timeSince(new Date(lastChecked))} ago`;
};
