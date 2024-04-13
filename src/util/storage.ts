import { LatLngExpression } from 'leaflet'

const SETTINGS_KEY = "settings";

export type Settings = {
  center: LatLngExpression;
  zoom: number;
};

const storage = {
  get(key: string) {
    const item = localStorage.getItem(key);

    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    return storage.get(key);
  },
  getSettings(): Settings {
    const item = storage.get(SETTINGS_KEY);

    if (!item) {
      return {
        zoom: 5,
        center: [54.482804559582554, -4.636230468750001],
      };
    }

    return item;
  },
  updateSettings(value: any): Settings {
    const settings = storage.get(SETTINGS_KEY) || {};
    return storage.set(SETTINGS_KEY, { ...settings, ...value });
  },
};

export default storage;
