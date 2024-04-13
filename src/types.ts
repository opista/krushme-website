export enum KrushemMachineStatus {
  Working = "working",
  Broken = "broken",
  Unknown = "unknown",
}

export type RestaurantOpenHours = {
  type: string;
  monday: OpenHoursDayOfWeek;
  tuesday: OpenHoursDayOfWeek;
  wednesday: OpenHoursDayOfWeek;
  thursday: OpenHoursDayOfWeek;
  friday: OpenHoursDayOfWeek;
  saturday: OpenHoursDayOfWeek;
  sunday: OpenHoursDayOfWeek;
};

export type OpenHoursDayOfWeek = { open: number; close: number };

export type RestaurantData = {
  id: string;
  address: string;
  coords: {
    longitude: number;
    latitude: number;
  };
  krushemMachineStatus: KrushemMachineStatus;
  lastChecked: Date;
  link: string;
  hours: RestaurantOpenHours[];
  name: string;
};

export type RestaurantStats = {
  unknown: number;
  broken: number;
  working: number;
  total: number;
};
