import {
  KrushemMachineStatus,
  MappedRestaurantData,
  MappedRestaurantLocationsData,
  MappedRestaurantStatusesData,
} from "@/types";

const GITHUB_API_URL = "https://api.github.com/gists";
const GIST_URL = `https://gist.githubusercontent.com/metacurb/${process.env.GIST_ID}/raw`;

type GistCommitsResponse = {
  version: string;
}[];

const getGistFile = async <T>(
  commitHash: string | null,
  filename: string
): Promise<T> => {
  const response = await fetch(
    `${GIST_URL}/${commitHash ? `${commitHash}/` : ""}${filename}`
  );

  if (!response.ok) {
    throw new Error(`The restaurant data Gist is missing ${filename}`);
  }

  return response.json();
};

export const getAllRestaurants = async (): Promise<MappedRestaurantData> => {
  const commitHash = await fetch(
    `${GITHUB_API_URL}/${process.env.GIST_ID}/commits?per_page=1`
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const commitsResponse: GistCommitsResponse = await response.json();
      return commitsResponse[0]?.version ?? null;
    })
    .catch(() => null);

  const [locationsData, statusesData] = await Promise.all([
    getGistFile<MappedRestaurantLocationsData>(commitHash, "locations.json"),
    getGistFile<MappedRestaurantStatusesData>(commitHash, "statuses.json"),
  ]);

  const statusesById = new Map(
    statusesData.statuses.map((status) => [status.id, status])
  );

  return {
    locations: locationsData.locations.map((location) => {
      const status = statusesById.get(location.id);

      return {
        ...location,
        krushemMachineStatus:
          status?.krushemMachineStatus ?? KrushemMachineStatus.Unknown,
        lastChecked: status?.lastChecked,
      };
    }),
    stats: statusesData.stats,
  };
};
