const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const getRelativeDay = (day: string, direction: 1 | -1) => {
  const dayIndex = days.indexOf(day.toLowerCase());

  if (dayIndex === -1) return null;

  if (direction === 1) {
    return days[dayIndex + 1] || days[0];
  }

  return days[dayIndex - 1] || days[days.length - 1];
};
