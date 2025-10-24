import { RestaurantOpenHours } from "@/types";
import { getStoreStatus } from "@/util/get-store-status";

export default function OpenOrClosed({
  hours,
  orderMode,
}: {
  hours: RestaurantOpenHours[];
  orderMode: string;
}) {
  const openHoursForMode = hours.find(
    ({ type }) => type.toLowerCase() === orderMode.toLowerCase()
  );

  const { color, label, text } = getStoreStatus(openHoursForMode);

  return (
    <span title={label} className={`font-bold ${color}`}>
      {text}
    </span>
  );
}
