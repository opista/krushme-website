import timeSince from "./time-since";

export const lastCheckedString = (lastChecked?: number) => {
  if (!lastChecked) return "Never checked";
  return `Last checked ${timeSince(lastChecked)} ago`;
};
