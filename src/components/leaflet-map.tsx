"use client";

import { ReactNode, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import LocateControl from "./locate-control";
import MapKeyControl from "./map-key-control";
import StatsControl from "./stats-control";
import storage, { Settings } from "@/util/storage";

type Props = {
  children?: ReactNode;
};

export default function LeafletMap({ children }: Props) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(storage.getSettings());
  }, []);

  if (!settings?.zoom || !settings?.center) return null;

  return (
    <MapContainer
      className="absolute z-10 top-0 h-full w-full"
      center={settings.center}
      zoom={settings.zoom}
      maxZoom={18}
      minZoom={5}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {children}
      <LocateControl />
      <StatsControl />
      <MapKeyControl />
    </MapContainer>
  );
}
