import { RestaurantStoreModel } from "@/types";

export const formatAddress = ({
  street,
  city,
  postalcode,
}: RestaurantStoreModel["meta"]) =>
  [street, city, postalcode]
    .filter(Boolean)
    .filter((value) => value.toLowerCase() !== "null")
    .map((value) => value.replace(/,\s*$/, ""))
    .join(", ");
