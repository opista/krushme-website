import { OpenHoursDayOfWeek, OpenHours } from "@/types";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const getNextOpenDay = (day: string, hours: OpenHours) => {
  const dayIndex = days.indexOf(day.toLowerCase());

  if (dayIndex === -1) return null;

  const sortedDays = [
    ...days.slice(dayIndex + 1, days.length),
    ...days.slice(0, dayIndex + 1),
  ];

  return sortedDays.find((sortedDay) => {
    const dayHours = hours[sortedDay as keyof OpenHours] as OpenHoursDayOfWeek;
    return dayHours && dayHours.open;
  });
};
