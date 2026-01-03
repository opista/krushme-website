import { getAllRestaurants } from "@/util/get-all-restaurants";
import HomeView from "./home-view";

import type { Metadata } from "next";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Krushme - Is your local KFC Krushem machine working?",
  description:
    "Check to see if your local KFC Krushem machine is broken using an interactive map",
};

export default async function Home() {
  const data = await getAllRestaurants();

  return <HomeView data={data} />;
}
