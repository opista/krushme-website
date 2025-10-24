import { render, screen } from "@testing-library/react";
import OpenOrClosed from "../open-or-closed";
import { RestaurantOpenHours } from "@/types";
import { DateTime } from "luxon";

// Mock DateTime.now() to have consistent test results
const mockNow = DateTime.fromISO("2024-01-15T14:30:00", {
  zone: "Europe/London",
});
jest.spyOn(DateTime, "now").mockReturnValue(mockNow);

describe("OpenOrClosed", () => {
  beforeEach(() => {
    // Reset the mock to use our fixed time
    jest.spyOn(DateTime, "now").mockReturnValue(mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render "Unavailable" when hours is empty', () => {
    render(<OpenOrClosed hours={[]} orderMode="standard" />);

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it('should render "Unavailable" when orderMode is not found', () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Delivery",
        monday: { open: 1000, close: 2200 },
        tuesday: { open: 1000, close: 2200 },
        wednesday: { open: 1000, close: 2200 },
        thursday: { open: 1000, close: 2200 },
        friday: { open: 1000, close: 2200 },
        saturday: { open: 1000, close: 2200 },
        sunday: { open: 1000, close: 2200 },
      },
    ];

    render(<OpenOrClosed hours={hours} orderMode="standard" />);

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  describe("Normal opening hours", () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Standard",
        monday: { open: 1000, close: 2200 },
        tuesday: { open: 1000, close: 2200 },
        wednesday: { open: 1000, close: 2200 },
        thursday: { open: 1000, close: 2200 },
        friday: { open: 1000, close: 2200 },
        saturday: { open: 1000, close: 2200 },
        sunday: { open: 1000, close: 2200 },
      },
    ];

    it('should render "Open until..." when store is open', () => {
      // Mock current time to be 2:30 PM - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
      expect(screen.getByText(/10:00 PM/)).toBeInTheDocument();
    });

    it('should render "Closed" when store is closed', () => {
      // Mock current time to be 9:30 AM - before 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText("Closed")).toBeInTheDocument();
    });
  });

  describe("Closing at midnight (close: 0)", () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Standard",
        monday: { open: 1000, close: 0 },
        tuesday: { open: 1000, close: 0 },
        wednesday: { open: 1000, close: 0 },
        thursday: { open: 1000, close: 0 },
        friday: { open: 1000, close: 0 },
        saturday: { open: 1000, close: 0 },
        sunday: { open: 1000, close: 0 },
      },
    ];

    it('should render "Open until..." when store is open before midnight', () => {
      // Mock current time to be 11:30 PM - before midnight closing
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
      expect(screen.getByText(/11:59 PM/)).toBeInTheDocument();
    });

    it('should render "Closed" when store is closed after midnight', () => {
      // Mock current time to be 12:30 AM - after midnight closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText("Closed")).toBeInTheDocument();
    });
  });

  describe("Closing after midnight (close: 100)", () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Standard",
        monday: { open: 1000, close: 100 },
        tuesday: { open: 1000, close: 100 },
        wednesday: { open: 1000, close: 100 },
        thursday: { open: 1000, close: 100 },
        friday: { open: 1000, close: 100 },
        saturday: { open: 1000, close: 100 },
        sunday: { open: 1000, close: 100 },
      },
    ];

    it('should render "Open until..." when store is open before midnight', () => {
      // Mock current time to be 11:30 PM - before midnight
      const mockTime = DateTime.fromISO("2024-01-15T23:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
      expect(screen.getByText(/1:00 AM/)).toBeInTheDocument();
    });

    it('should render "Open until..." when store is open between midnight and 1:00 AM', () => {
      // Mock current time to be 12:30 AM - between midnight and 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
      expect(screen.getByText(/1:00 AM/)).toBeInTheDocument();
    });

    it('should render "Open until..." when store is between midnight and 1:00 AM', () => {
      // Mock current time to be 12:30 AM - between midnight and 1:00 AM closing
      const mockTime = DateTime.fromISO("2024-01-15T00:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
      expect(screen.getByText(/1:00 AM/)).toBeInTheDocument();
    });
  });

  describe("Case-insensitive orderMode matching", () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Delivery",
        monday: { open: 1000, close: 2200 },
        tuesday: { open: 1000, close: 2200 },
        wednesday: { open: 1000, close: 2200 },
        thursday: { open: 1000, close: 2200 },
        friday: { open: 1000, close: 2200 },
        saturday: { open: 1000, close: 2200 },
        sunday: { open: 1000, close: 2200 },
      },
    ];

    it("should match orderMode case-insensitively", () => {
      // Mock current time to be 2:30 PM - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="DELIVERY" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
    });

    it("should match orderMode with mixed case", () => {
      // Mock current time to be 2:30 PM - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="delivery" />);

      expect(screen.getByText(/Open until/)).toBeInTheDocument();
    });
  });

  describe("Tooltip functionality", () => {
    const hours: RestaurantOpenHours[] = [
      {
        type: "Standard",
        monday: { open: 1000, close: 2200 },
        tuesday: { open: 1000, close: 2200 },
        wednesday: { open: 1000, close: 2200 },
        thursday: { open: 1000, close: 2200 },
        friday: { open: 1000, close: 2200 },
        saturday: { open: 1000, close: 2200 },
        sunday: { open: 1000, close: 2200 },
      },
    ];

    it("should have a title attribute for tooltip when store is open", () => {
      // Mock current time to be 2:30 PM - within 10:00-22:00 hours
      const mockTime = DateTime.fromISO("2024-01-15T14:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      const element = screen.getByText(/Open until/);
      expect(element).toHaveAttribute("title");
    });

    it("should have a title attribute for tooltip when store is closed", () => {
      // Mock current time to be 9:30 AM - before 10:00 opening
      const mockTime = DateTime.fromISO("2024-01-15T09:30:00", {
        zone: "Europe/London",
      });
      jest.spyOn(DateTime, "now").mockReturnValue(mockTime);

      render(<OpenOrClosed hours={hours} orderMode="standard" />);

      const element = screen.getByText("Closed");
      expect(element).toHaveAttribute("title");
    });
  });
});
