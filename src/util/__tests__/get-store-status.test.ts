import { getStoreStatus } from "../get-store-status";
import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";

// Mock DateTime.now() to have consistent test results
const mockNow = DateTime.fromISO("2024-01-15T14:30:00", {
  zone: "Europe/London",
});
jest.spyOn(DateTime, "now").mockReturnValue(mockNow);

describe("getStoreStatus", () => {
  beforeEach(() => {
    // Reset the mock to use our fixed time
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return unavailable status when hours is undefined", () => {
    const result = getStoreStatus(undefined);
    
    expect(result).toEqual({
      color: "text-gray-500",
      label: "",
      text: "Unavailable",
    });
  });

  it("should return unavailable status when weekdayLong is not available", () => {
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

    const result = getStoreStatus(openHours);
    
    expect(result).toEqual({
      color: "text-gray-500",
      label: "",
      text: "Unavailable",
    });
  });

  describe("Store is open", () => {
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

    it("should return open status when store is currently open", () => {
      // Mock current time to be 2:30 PM (14:30) - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = getStoreStatus(openHours);
      
      expect(result.color).toBe("text-green-600");
      expect(result.text).toBe("Open until 10:00 PM");
      expect(result.label).toContain("Closes");
    });
  });

  describe("Store is closed", () => {
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

    it("should return closed status when store is closed", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = getStoreStatus(openHours);
      
      expect(result.color).toBe("text-red-600");
      expect(result.text).toBe("Closed");
      expect(result.label).toContain("Re-opens");
    });

    it("should show today's opening time when closed early morning on an open day", () => {
      // Mock current time to be Saturday 1:06 AM - after Friday's 23:00 closing, before Saturday's 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-20T01:06:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const hours: RestaurantOpenHours = {
        type: "Standard",
        monday: { open: 1000, close: 2200 },
        tuesday: { open: 1000, close: 2200 },
        wednesday: { open: 1000, close: 2200 },
        thursday: { open: 1000, close: 2200 },
        friday: { open: 1000, close: 2300 }, // Closed Friday at 23:00
        saturday: { open: 1000, close: 2200 }, // Opens Saturday at 10:00
        sunday: { open: 1000, close: 2200 },
      };

      const result = getStoreStatus(hours);
      
      expect(result.color).toBe("text-red-600");
      expect(result.text).toBe("Closed");
      expect(result.label).toBe("Re-opens at 10:00 AM");
    });
  });

  describe("Edge cases", () => {
    it("should handle midnight closing (close: 0)", () => {
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

      // Mock current time to be 11:30 PM - before midnight closing
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = getStoreStatus(openHours);
      
      expect(result.color).toBe("text-green-600");
      expect(result.text).toBe("Open until 11:59 PM");
      expect(result.label).toContain("Closes");
    });

    it("should handle post-midnight closing (close: 100)", () => {
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

      // Mock current time to be 12:30 AM - between midnight and 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      const result = getStoreStatus(openHours);
      
      expect(result.color).toBe("text-green-600");
      expect(result.text).toBe("Open until 1:00 AM");
      expect(result.label).toContain("Closes");
    });
  });
});
