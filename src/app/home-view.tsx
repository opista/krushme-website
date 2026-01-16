"use client";

import { Time } from "@/components/time";
import { RestaurantProvider } from "@/context/restaurant-context";
import dynamic from "next/dynamic";
import { MappedRestaurantData } from "@/types";
import { useMemo } from "react";

const RestaurantMap = dynamic(() => import("@/components/restaurant-map"), {
  ssr: false,
});

type HomeViewProps = {
  data: MappedRestaurantData;
};

export default function HomeView({ data }: HomeViewProps) {
  // Optimization: Use reduce instead of sort to avoid mutating the array and improve performance from O(N log N) to O(N)
  const mostRecentCheck = useMemo(() => {
    if (!data?.locations?.length) return undefined;

    let maxDate = new Date(0);
    let mostRecent = data.locations[0].lastChecked;

    for (const location of data.locations) {
      if (location.lastChecked) {
        const date = new Date(location.lastChecked);
        if (date > maxDate) {
          maxDate = date;
          mostRecent = location.lastChecked;
        }
      }
    }
    return mostRecent;
  }, [data?.locations]);

  return (
    <div className="flex flex-col max-w-7xl mx-auto relative h-svh">
      <div className="fixed top-0 z-50 w-full max-w-7xl flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="font-friz font-bold italic text-lg uppercase text-kfc mb-0 leading-none">
            Krushme
          </h1>
          <p className="p-0 leading-none text-sm">
            Is your local KFC Krushem machine broken?
          </p>
        </div>
        <div className="hidden sm:block">
          <Time lastChecked={mostRecentCheck} />
        </div>
      </div>

      <div className="absolute top-16 bottom-11 w-full">
        <RestaurantProvider
          restaurants={data?.locations || []}
          stats={data?.stats}
        >
          <RestaurantMap />
        </RestaurantProvider>
      </div>

      <div className="px-6 flex justify-between fixed bottom-0 z-50 max-w-7xl w-full">
        <span>
          <a
            className="inline-block p-3 underline hover:underline-offset-2 hover:text-gray-900 text-sm font-bold"
            href="mailto:krushme@opista.com"
          >
            Contact 📧
          </a>
        </span>
        <span>
          <a
            className="inline-block p-3 underline hover:underline-offset-2 text-sky-600 hover:text-sky-500 text-sm font-bold"
            href="https://www.buymeacoffee.com/krushme"
            rel="nofollow"
            target="_blank"
          >
            Buy me a Krushem ❤
          </a>
        </span>
      </div>
    </div>
  );
}
