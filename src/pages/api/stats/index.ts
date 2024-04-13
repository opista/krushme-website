import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await axios.get(process.env.KRUSHME_JSON_API as string);
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).json(response.data);
}
