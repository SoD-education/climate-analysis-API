import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const client = new MongoClient(connectionString);

// Function to connect to the database and create the index
async function connectAndCreateIndex() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log("Connected to MongoDB");
  }

  const db = client.db("climate-api");

  // Create an index on the "Time.Unix" field
  await db.collection("climate-data").createIndex({ "Time.Unix": 1 });

  return db;
}

// Connect to the database and create the index if it doesn't exist
const dbPromise = connectAndCreateIndex();

// Export the connected database instance
export const db = () => dbPromise;

// Function to test if the connection was successful
export async function testConnection() {
  const database = await dbPromise;
  const result = await database.command({ ping: 1 });
  if (result.ok === 1) {
    console.log("MongoDB connection test passed");
  } else {
    console.log("MongoDB connection test failed");
  }
}
