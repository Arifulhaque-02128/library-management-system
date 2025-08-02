import { MongoClient, ServerApiVersion } from 'mongodb';

const dbConnect = async (collectionName : string) => {

  const uri = process.env.MONGODB_URI;
  const db = process.env.DB_NAME;
  
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  return client.db(db).collection(collectionName);

}

export default dbConnect;