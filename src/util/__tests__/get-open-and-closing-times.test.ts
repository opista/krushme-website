import { getOpeningAndClosingTimes } from "../get-open-and-closing-times";
import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";

// Mock DateTime.now() to have consistent test results
const mockNow = DateTime.fromISO("2024-01-15T14:30:00", {
  zone: "Europe/London",
});
jest.spyOn(DateTime, "now").mockReturnValue(mockNow);

describe("getOpeningAndClosingTimes", () => {
  beforeEach(() => {
    // Reset the mock to use our fixed time
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return null when openHours is undefined", () => {
    const result = getOpeningAndClosingTimes(undefined, "monday");
    expect(result).toBeNull();
  });

  it("should return null when dayOfWeek is null", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 2200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      sunday: { open: 1000, close: 2200 },
    };

    const result = getOpeningAndClosingTimes(openHours, null);
    expect(result).toBeNull();
  });

  it("should return null when dayOfWeek is not found", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 2200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      sunday: { open: 1000, close: 2200 },
    };

    const result = getOpeningAndClosingTimes(openHours, "invalidday");
    expect(result).toBeNull();
  });

  it("should handle normal opening hours (same day)", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 2200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      sunday: { open: 1000, close: 2200 },
    };

    const result = getOpeningAndClosingTimes(openHours, "monday");

    expect(result).not.toBeNull();
    expect(result?.openingTime.hour).toBe(10);
    expect(result?.openingTime.minute).toBe(0);
    expect(result?.closingTime.hour).toBe(22);
    expect(result?.closingTime.minute).toBe(0);
    expect(result?.openingTime.day).toBe(result?.closingTime.day);
  });

  it("should handle closing at midnight (close: 0)", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 0 },
      tuesday: { open: 1000, close: 0 },
      wednesday: { open: 1000, close: 0 },
      thursday: { open: 1000, close: 0 },
      friday: { open: 1000, close: 0 },
      saturday: { open: 1000, close: 0 },
      sunday: { open: 1000, close: 0 },
    };

    const result = getOpeningAndClosingTimes(openHours, "monday");

    expect(result).not.toBeNull();
    expect(result?.openingTime.hour).toBe(10);
    expect(result?.openingTime.minute).toBe(0);
    expect(result?.closingTime.hour).toBe(23);
    expect(result?.closingTime.minute).toBe(59);
    // Closing time should be same day (end of day)
    expect(result?.closingTime.day).toBe(result?.openingTime.day);
  });

  it("should handle closing after midnight (close: 100)", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 100 },
      tuesday: { open: 1000, close: 100 },
      wednesday: { open: 1000, close: 100 },
      thursday: { open: 1000, close: 100 },
      friday: { open: 1000, close: 100 },
      saturday: { open: 1000, close: 100 },
      sunday: { open: 1000, close: 100 },
    };

    const result = getOpeningAndClosingTimes(openHours, "monday");

    expect(result).not.toBeNull();
    expect(result?.openingTime.hour).toBe(10);
    expect(result?.openingTime.minute).toBe(0);
    expect(result?.closingTime.hour).toBe(1);
    expect(result?.closingTime.minute).toBe(0);
    // Closing time should be next day
    expect(result?.closingTime.day).toBe(result?.openingTime.day + 1);
  });

  it("should handle closing after midnight with minutes (close: 309)", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 309 },
      tuesday: { open: 1000, close: 309 },
      wednesday: { open: 1000, close: 309 },
      thursday: { open: 1000, close: 309 },
      friday: { open: 1000, close: 309 },
      saturday: { open: 1000, close: 309 },
      sunday: { open: 1000, close: 309 },
    };

    const result = getOpeningAndClosingTimes(openHours, "monday");

    expect(result).not.toBeNull();
    expect(result?.openingTime.hour).toBe(10);
    expect(result?.openingTime.minute).toBe(0);
    expect(result?.closingTime.hour).toBe(3);
    expect(result?.closingTime.minute).toBe(9);
    // Closing time should be next day
    expect(result?.closingTime.day).toBe(result?.openingTime.day + 1);
  });

  it("should handle case-insensitive day names", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1000, close: 2200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      sunday: { open: 1000, close: 2200 },
    };

    const result1 = getOpeningAndClosingTimes(openHours, "MONDAY");
    const result2 = getOpeningAndClosingTimes(openHours, "Monday");
    const result3 = getOpeningAndClosingTimes(openHours, "monday");

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });

  it("should handle edge case where open and close are the same time", () => {
    const openHours: RestaurantOpenHours = {
      type: "Standard",
      monday: { open: 1200, close: 1200 },
      tuesday: { open: 1000, close: 2200 },
      wednesday: { open: 1000, close: 2200 },
      thursday: { open: 1000, close: 2200 },
      friday: { open: 1000, close: 2200 },
      saturday: { open: 1000, close: 2200 },
      sunday: { open: 1000, close: 2200 },
    };

    const result = getOpeningAndClosingTimes(openHours, "monday");

    expect(result).not.toBeNull();
    expect(result?.openingTime.hour).toBe(12);
    expect(result?.openingTime.minute).toBe(0);
    expect(result?.closingTime.hour).toBe(12);
    expect(result?.closingTime.minute).toBe(0);
    // Closing time should be next day when open === close
    expect(result?.closingTime.day).toBe(result?.openingTime.day + 1);
  });
});
