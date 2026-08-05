import {
  KrushemMachineStatus,
  CompactRestaurantStatusesData,
  CompactRestaurantLocationsData,
  MappedRestaurantData,
  MappedRestaurantLocationsData,
  MappedRestaurantStatusesData,
  OpenHours,
} from "@/types";

const GITHUB_API_URL = "https://api.github.com/gists";
const GIST_URL = `https://gist.githubusercontent.com/metacurb/${process.env.GIST_ID}/raw`;

type GistCommitsResponse = {
  version: string;
}[];

const hourTypes = ["standard", "collect", "delivery", "drivethru"] as const;
const decodeHours = (
  hours: [0 | 1 | 2 | 3, number[]][]
): OpenHours[] =>
  hours.map(([type, times]) => ({
    groupId: "",
    type: hourTypes[type],
    monday: { open: times[0], close: times[1] },
    tuesday: { open: times[2], close: times[3] },
    wednesday: { open: times[4], close: times[5] },
    thursday: { open: times[6], close: times[7] },
    friday: { open: times[8], close: times[9] },
    saturday: { open: times[10], close: times[11] },
    sunday: { open: times[12], close: times[13] },
  }));

const decodeLocations = (
  data: MappedRestaurantLocationsData | CompactRestaurantLocationsData
): MappedRestaurantLocationsData => {
  if ("locations" in data) return data;

  return {
    locations: data.r.map(([id, name, address, latitude, longitude, path, hours]) => ({
      id,
      name,
      address,
      coords: { latitude, longitude },
      link: `https://www.kfc.co.uk${path}`,
      hours: decodeHours(hours),
    })),
  };
};

const decodeStatuses = (
  data: CompactRestaurantStatusesData
): MappedRestaurantStatusesData => {
  const statusByCode = [
    KrushemMachineStatus.Working,
    KrushemMachineStatus.Broken,
    KrushemMachineStatus.Unknown,
  ] as const;
  const [working, broken, unknown, total] = data.t;

  return {
    statuses: data.r.map(([id, status, checkedAt]) => ({
      id,
      krushemMachineStatus: statusByCode[status],
      lastChecked: checkedAt === null ? undefined : checkedAt * 1000,
    })),
    stats: { working, broken, unknown, total },
  };
};

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

  const [locationPayload, statusPayload] = await Promise.all([
    getGistFile<MappedRestaurantLocationsData | CompactRestaurantLocationsData>(commitHash, "locations.json"),
    getGistFile<CompactRestaurantStatusesData>(commitHash, "statuses.json"),
  ]);
  const locationsData = decodeLocations(locationPayload);
  const statusesData = decodeStatuses(statusPayload);

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
