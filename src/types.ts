export type OpenHoursWeekDay = { open: number; close: number };

export type OpenHours = {
  groupId: string;
  type: string;
  monday: OpenHoursWeekDay;
  tuesday: OpenHoursWeekDay;
  wednesday: OpenHoursWeekDay;
  thursday: OpenHoursWeekDay;
  friday: OpenHoursWeekDay;
  saturday: OpenHoursWeekDay;
  sunday: OpenHoursWeekDay;
};

export enum KrushemMachineStatus {
  Working = "working",
  Broken = "broken",
  Unknown = "unknown",
}

export type OpenHoursDayOfWeek = { open: number; close: number };

export type RestaurantData = {
  id: string;
  address: string;
  coords: {
    longitude: number;
    latitude: number;
  };
  krushemMachineStatus: KrushemMachineStatus;
  lastChecked?: number;
  link: string;
  hours: OpenHours[];
  name: string;
};

export type RestaurantLocationData = Omit<
  RestaurantData,
  "krushemMachineStatus" | "lastChecked"
>;

export type RestaurantStatusData = Pick<
  RestaurantData,
  "id" | "krushemMachineStatus" | "lastChecked"
>;

export type RestaurantStats = {
  unknown: number;
  broken: number;
  working: number;
  total: number;
};

export type MappedRestaurantData = {
  locations: RestaurantData[];
  stats: RestaurantStats;
};

export type MappedRestaurantLocationsData = {
  locations: RestaurantLocationData[];
};

export type MappedRestaurantStatusesData = {
  statuses: RestaurantStatusData[];
  stats: RestaurantStats;
};
