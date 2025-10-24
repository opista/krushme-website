import { getNextOpenDay } from "../get-next-open-day";
import { RestaurantOpenHours } from "@/types";

describe("getNextOpenDay Sunday to Monday transition", () => {
  it("should find Monday as next open day when starting from Sunday", () => {
    const hours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 2200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      // Sunday is not included, so it's effectively closed
    };

    const result = getNextOpenDay("sunday", hours);
    expect(result).toBe("monday");
  });

  it("should find Tuesday as next open day when starting from Sunday and Monday is closed", () => {
    const hours: RestaurantOpenHours = {
      type: "Standard",
      // Monday is not included, so it's effectively closed
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      // Sunday is not included, so it's effectively closed
    };

    const result = getNextOpenDay("sunday", hours);
    expect(result).toBe("tuesday");
  });
});
