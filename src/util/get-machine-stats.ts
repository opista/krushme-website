import { MachineStatsHistory } from "@/types";

const GITHUB_API_URL = "https://api.github.com/gists";
const GIST_URL = `https://gist.githubusercontent.com/metacurb/${process.env.GIST_ID}/raw`;

type GistCommitsResponse = {
  version: string;
}[];

export const getMachineStats = async (): Promise<MachineStatsHistory> => {
  const commitHash = await fetch(
    `${GITHUB_API_URL}/${process.env.GIST_ID}/commits?per_page=1`
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const commitsResponse: GistCommitsResponse = await response.json();
      return commitsResponse[0]?.version ?? null;
    })
    .catch(() => null);

  const response = await fetch(
    `${GIST_URL}/${commitHash ? `${commitHash}/` : ""}machine-stats.json`
  );

  if (!response.ok) {
    throw new Error("The restaurant data Gist is missing machine-stats.json");
  }

  return response.json();
};
