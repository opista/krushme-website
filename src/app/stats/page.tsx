import type { Metadata } from "next";
import { getMachineStats } from "@/util/get-machine-stats";
import StatsView from "./stats-view";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Krunch Shake machine history | Krushme",
  description:
    "See how KFC Krunch Shake (RIP Krushems) machine availability has changed over the last 30 days.",
};

export default async function StatsPage() {
  const data = await getMachineStats();

  return <StatsView data={data} />;
}
