"use client";

import { Time } from "@/components/time";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { RestaurantProvider } from "@/context/restaurant-context";
import dynamic from "next/dynamic";
import { MappedRestaurantData } from "@/types";
import { useMemo } from "react";
import { getMostRecentCheck } from "@/util/get-most-recent-check";

const RestaurantMap = dynamic(() => import("@/components/restaurant-map"), {
  ssr: false,
});

type HomeViewProps = {
  data: MappedRestaurantData;
  cartoApiKey?: string;
};

export default function HomeView({ data, cartoApiKey }: HomeViewProps) {
  const mostRecentCheck = useMemo(
    () => getMostRecentCheck(data?.locations),
    [data?.locations]
  );

  return (
    <div className="relative flex h-svh flex-col">
      <SiteHeader fixed right={<div className="hidden sm:block"><Time lastChecked={mostRecentCheck} /></div>} />

      <div className="absolute top-16 bottom-11 w-full">
        <RestaurantProvider
          restaurants={data?.locations || []}
          stats={data?.stats}
        >
          <RestaurantMap cartoApiKey={cartoApiKey} />
        </RestaurantProvider>
      </div>

      <SiteFooter fixed showHistory />
    </div>
  );
}
