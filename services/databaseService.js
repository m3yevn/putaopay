import { ServerApiVersion, MongoClient } from "mongodb";

class DatabaseService {
  constructor(props) {}

  createDB() {
    try {
      this.connectionString = process.env.DATABASE_CONNECTION_STRING;
      this.client = new MongoClient(this.connectionString, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      console.log("Database connection is established.");
    } catch (ex) {
      console.error("Database connection is failed.", ex);
    }
  }
}

export default new DatabaseService();
