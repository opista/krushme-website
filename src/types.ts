import { ObjectId } from "mongodb";

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

export type OrderMode = {
  modeType: string;
  serviceType: string;
};

export type Restaurant = {
  city: string;
  link: string;
  geolocation: {
    longitude: number;
    latitude: number;
  };
  hours: OpenHours[];
  name: string;
  orderModes: OrderMode[];
  postalcode: string;
  refid: string;
  storeid: string;
  street: string;
};

export enum KrushemMachineStatus {
  Working = "working",
  Broken = "broken",
  Unknown = "unknown",
}

export type RestaurantStoreModel = {
  _id?: ObjectId;
  refId: Restaurant["refid"];
  meta: Restaurant;
  krushemMachineStatus: KrushemMachineStatus;
  checkedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
  lastChecked?: Date;
  link: string;
  hours: OpenHours[];
  name: string;
};

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
