import { getAllRestaurants } from "@/util/get-all-restaurants";
import HomeView from "./home-view";

import type { Metadata } from "next";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Krushme - Is your local KFC Krunch Shake (Krushem) machine working?",
  description:
    "Krushems have been replaced by Krunch Shakes (RIP). Check if your local KFC Krunch Shake machine is working or broken using our interactive map.",
};

export default async function Home() {
  const data = await getAllRestaurants();

  return <HomeView data={data} />;
}
