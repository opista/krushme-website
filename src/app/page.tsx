import clientPromise from "@/util/mongo/client";
import { getAllRestaurants } from "@/util/mongo/get-restaurants";
import HomeView from "./home-view";

export const revalidate = 300;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Krushme - Is your local KFC Krushem machine working?",
  description:
    "Check to see if your local KFC Krushem machine is broken using an interactive map",
};

export default async function Home() {
  const client = await clientPromise;
  const db = client.db("krushme");

  const data = await getAllRestaurants(db);

  return <HomeView data={data} />;
}
