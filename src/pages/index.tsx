import { RestaurantProvider } from "@/context/restaurant-context";
import { RestaurantData } from "@/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import MapOverlay from "@/components/map-overlay";
import { Time } from "@/components/time";

const RestaurantMap = dynamic(() => import("@/components/restaurant-map"), {
  ssr: false,
});

type ApiResponse = {
  locations: RestaurantData[];
  stats: { unknown: number; broken: number; working: number; total: number };
};

function Home() {
  const [data, setData] = useState<ApiResponse>({
    locations: [],
    stats: {
      working: 0,
      broken: 0,
      unknown: 0,
      total: 0,
    },
  });
  const [hasError, setHasError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data: ApiResponse) => setData(data))
      .catch((err) => setHasError(true))
      .then(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Krushme - Is your local KFC Krushem machine working?</title>
        <meta
          name="description"
          content="Check to see if your local KFC Krushem machine is broken using an interactive map"
        />
      </Head>
      <div className="flex flex-col max-w-7xl mx-auto relative h-svh">
        <div className="fixed top-0 z-50 w-full max-w-7xl flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="font-serif font-bold italic text-lg uppercase text-kfc mb-0 leading-none">
              Krushme
            </h1>
            <p className="p-0 leading-none text-sm">
              Is your local KFC Krushem machine broken?
            </p>
          </div>
          <div className="hidden sm:block">
            <Time />
          </div>
        </div>

        <div className="absolute top-16 bottom-11 w-full">
          <MapOverlay hasError={hasError} isLoading={isLoading}></MapOverlay>
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
              className="inline-block p-3 pr-0 underline hover:underline-offset-2 hover:text-gray-900 text-sm font-bold"
              href="mailto:contact@krushme.co.uk"
            >
              Contact
            </a>
            📧
          </span>
          <span>
            <a
              className="inline-block p-3 pr-0 underline hover:underline-offset-2 text-sky-600 hover:text-sky-500 text-sm font-bold"
              href="https://www.buymeacoffee.com/krushme"
              rel="nofollow"
              target="_blank"
            >
              Buy me a Krushem
            </a>
            ❤
          </span>
        </div>
      </div>
    </>
  );
}

export default Home;
