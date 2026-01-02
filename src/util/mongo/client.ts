import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env");
}

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default client;
