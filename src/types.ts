export enum KrushemMachineStatus {
  Working = "working",
  Broken = "broken",
  Unknown = "unknown",
}

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
  isOpenCollection: boolean | null;
  isOpenDelivery: boolean | null;
  isOpenDriveThru: boolean | null;
  isOpenStandard: boolean | null;
  name: string;
};

export type RestaurantStats = {
  unknown: number;
  broken: number;
  working: number;
  total: number;
};
