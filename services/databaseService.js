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
      this.db = this.client.db(process.env.DATABASE_NAME);
      console.log("Database connection is established.");
    } catch (ex) {
      console.error("Database connection is failed.", ex);
    }
  }

  async createOrder(transaction) {
    try {
      await this.db.collection("orders").insertOne(transaction);
      console.log(`Transaction ${transaction.referenceId} is saved.`);
    } catch (ex) {
      console.error("Saving order transaction is failed.", ex);
    }
  }
}

export default new DatabaseService();
