import { MappedRestaurantData } from "@/types";

const GITHUB_API_URL = "https://api.github.com/gists";
const GIST_URL = `https://gist.githubusercontent.com/metacurb/${process.env.GIST_ID}/raw`;

type GistCommitsResponse = {
  version: string;
}[];

export const getAllRestaurants = async (): Promise<MappedRestaurantData> => {
  const commitsResponse: GistCommitsResponse = await fetch(
    `${GITHUB_API_URL}/${process.env.GIST_ID}/commits?per_page=1`
  ).then((res) => res.json());

  const commitHash = commitsResponse[0].version;

  return await fetch(`${GIST_URL}/${commitHash}/restaurants.json`).then((res) =>
    res.json()
  );
};
