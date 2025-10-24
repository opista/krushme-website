import { getTimeUntilClosing } from "../get-time-until-closing";
import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";

// Mock DateTime.now() to have consistent test results
const mockNow = DateTime.fromISO("2024-01-15T14:30:00", {
  zone: "Europe/London",
});
jest.spyOn(DateTime, "now").mockReturnValue(mockNow);

describe("getTimeUntilClosing", () => {
  beforeEach(() => {
    // Reset the mock to use our fixed time
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    it("should return correct time when current time is within opening hours", () => {
      // Mock current time to be 2:30 PM (14:30) - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 7 hours 30 minutes");
      expect(result?.closingTime.hour).toBe(22);
      expect(result?.closingTime.minute).toBe(0);
    });

    it("should return correct time for minutes only", () => {
      // Mock current time to be 9:30 PM (21:30) - 30 minutes before closing
      const mockTime = DateTime.fromISO("2024-01-15T21:30:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 30 minutes");
    });

    it("should return correct time for hours only", () => {
      // Mock current time to be 8:00 PM (20:00) - 2 hours before closing
      const mockTime = DateTime.fromISO("2024-01-15T20:00:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 2 hours");
    });

    it("should return correct time for single hour", () => {
      // Mock current time to be 9:00 PM (21:00) - 1 hour before closing
      const mockTime = DateTime.fromISO("2024-01-15T21:00:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 1 hour");
    });

    it("should return correct time for single minute", () => {
      // Mock current time to be 9:59 PM (21:59) - 1 minute before closing
      const mockTime = DateTime.fromISO("2024-01-15T21:59:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 1 minute");
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

    it("should return correct time when current time is before midnight", () => {
      // Mock current time to be 11:30 PM (23:30) - before midnight
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 1 hour 30 minutes");
      expect(result?.closingTime.hour).toBe(1);
      expect(result?.closingTime.minute).toBe(0);
    });

    it("should return correct time when current time is between midnight and closing", () => {
      // Mock current time to be 12:30 AM (00:30) - between midnight and 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 30 minutes");
      expect(result?.closingTime.hour).toBe(1);
      expect(result?.closingTime.minute).toBe(0);
    });

    it("should return correct time for early morning hours", () => {
      // Mock current time to be 12:04 AM (00:04) - 56 minutes before 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:04:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 56 minutes");
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

    it("should return correct time when current time is between midnight and closing", () => {
      // Mock current time to be 2:00 AM (02:00) - between midnight and 3:09 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T02:00:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 1 hour 9 minutes");
      expect(result?.closingTime.hour).toBe(3);
      expect(result?.closingTime.minute).toBe(9);
    });

    it("should return correct time for minutes only before closing", () => {
      // Mock current time to be 3:00 AM (03:00) - 9 minutes before 3:09 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T03:00:00", {
        zone: "Europe/London",
      });

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 9 minutes");
    });
  });

  describe("Edge cases", () => {
    it("should return null when hours is undefined", () => {
      const result = getTimeUntilClosing(undefined as any, mockNow);
      expect(result).toBeNull();
    });

    it("should return null when weekdayLong is not available", () => {
      const mockDateTimeWithoutWeekday = {
        ...mockNow,
        weekdayLong: undefined,
      } as any;

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

      const result = getTimeUntilClosing(openHours, mockDateTimeWithoutWeekday);
      expect(result).toBeNull();
    });

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

      const result = getTimeUntilClosing(openHours, mockTime);

      expect(result).not.toBeNull();
      expect(result?.timeUntilClosing).toBe("in 8 hours 30 minutes");
      expect(result?.closingTime.hour).toBe(23);
      expect(result?.closingTime.minute).toBe(59);
    });
  });
});
