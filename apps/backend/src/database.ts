import * as mongoDB from 'mongodb';

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  return db;
}
