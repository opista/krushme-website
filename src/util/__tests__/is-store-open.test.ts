import { isStoreOpen } from "../is-store-open";
import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";

// Mock DateTime.now() to have consistent test results
const mockNow = DateTime.fromISO("2024-01-15T14:30:00", {
  zone: "Europe/London",
});
jest.spyOn(DateTime, "now").mockReturnValue(mockNow);

describe("isStoreOpen", () => {
  beforeEach(() => {
    // Reset the mock to use our fixed time
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return null when hours is undefined", () => {
    const result = isStoreOpen(undefined);
    expect(result).toBeNull();
  });

  it("should return null when weekdayLong is not available", () => {
    // Mock DateTime.now() to return an object without weekdayLong
    const mockDateTimeWithoutWeekday = {
      ...mockNow,
      weekdayLong: undefined,
      setZone: (zone: string) => mockDateTimeWithoutWeekday,
    } as any;
    jest.spyOn(DateTime, "now").mockReturnValue(mockDateTimeWithoutWeekday);

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

    const result = isStoreOpen(openHours);
    expect(result).toBeNull();
  });

  describe("Normal opening hours (same day)", () => {
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

    it("should return true when current time is within opening hours", () => {
      // Mock current time to be 2:30 PM (14:30) - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true);
    });

    it("should return false when current time is before opening", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });

    it("should return false when current time is after closing", () => {
      // Mock current time to be 10:30 PM - after 22:00 closing
      const mockTime = DateTime.fromISO("2024-01-15T22:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });
  });

  describe("Closing at midnight (close: 0)", () => {
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

    it("should return true when current time is before midnight", () => {
      // Mock current time to be 11:30 PM - before midnight closing
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true);
    });

    it("should return false when current time is exactly midnight", () => {
      // Mock current time to be exactly midnight - store should be closed
      const mockTime = DateTime.fromISO("2024-01-15T00:00:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });

    it("should return false when current time is after midnight", () => {
      // Mock current time to be 12:30 AM on Tuesday - after Monday's midnight closing
      const mockTime = DateTime.fromISO("2024-01-16T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });

    it("should return false when current time is before opening", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });
  });

  describe("Closing after midnight (close: 100)", () => {
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

    it("should return true when current time is before midnight", () => {
      // Mock current time to be 11:30 PM - before midnight
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true);
    });

    it("should return true when current time is between midnight and 1:00 AM", () => {
      // Mock current time to be 12:30 AM - between midnight and 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true);
    });

    it("should return true when current time is between midnight and 1:00 AM", () => {
      // Mock current time to be 12:30 AM - still in yesterday's extended hours
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true); // Should be true as we're still in extended hours
    });

    it("should return false when current time is after yesterday extended hours but before opening", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening and after 1:00 AM close
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });
  });

  describe("Closing after midnight with minutes (close: 309)", () => {
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

    it("should return true when current time is between midnight and 3:09 AM", () => {
      // Mock current time to be 2:00 AM - between midnight and 3:09 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T02:00:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true);
    });

    it("should return true when current time is between midnight and 3:09 AM", () => {
      // Mock current time to be 2:00 AM - still in yesterday's extended hours
      const mockTime = DateTime.fromISO("2024-01-15T02:00:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true); // Should be true as we're still in extended hours
    });

    it("should return false when current time is after yesterday extended hours but before opening", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening and after 3:09 AM close
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle 24-hour operation (open: 0, close: 0)", () => {
      const openHours: RestaurantOpenHours = {
        type: "Standard",
        monday: { open: 0, close: 0 },
        tuesday: { open: 0, close: 0 },
        wednesday: { open: 0, close: 0 },
        thursday: { open: 0, close: 0 },
        friday: { open: 0, close: 0 },
        saturday: { open: 0, close: 0 },
        sunday: { open: 0, close: 0 },
      };

      // Mock current time to be any time
      const mockTime = DateTime.fromISO("2024-01-15T15:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(true); // Should be open 24/7
    });

    it("should handle very early morning opening (open: 100, close: 2200)", () => {
      const openHours: RestaurantOpenHours = {
        type: "Standard",
        monday: { open: 100, close: 2200 },
        tuesday: { open: 100, close: 2200 },
        wednesday: { open: 100, close: 2200 },
        thursday: { open: 100, close: 2200 },
        friday: { open: 100, close: 2200 },
        saturday: { open: 100, close: 2200 },
        sunday: { open: 100, close: 2200 },
      };

      // Mock current time to be 12:30 AM - before 1:00 AM opening, should be closed
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = isStoreOpen(openHours);
      expect(result).toBe(false);
    });
  });
});
