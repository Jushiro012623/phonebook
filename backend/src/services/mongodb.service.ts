import { Injectable } from "@app/decorators";
import config from "@app/config/config";

interface MongoDBConnection {
  client: any;
  db: any;
  isConnected: boolean;
}

@Injectable()
export class MongoDBService {
  private connection: MongoDBConnection | null = null;

  async connect(): Promise<void> {
    try {
      const { MongoClient } = await import("mongodb");
      
      const client = new MongoClient(config.mongodb.uri);
      await client.connect();
      
      const db = client.db(config.mongodb.database);
      
      this.connection = {
        client,
        db,
        isConnected: true,
      };

      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection?.client) {
      await this.connection.client.close();
      this.connection.isConnected = false;
      console.log("MongoDB disconnected");
    }
  }

  getClient() {
    if (!this.connection?.isConnected) {
      throw new Error("MongoDB is not connected");
    }
    return this.connection.client;
  }

  getDb() {
    if (!this.connection?.isConnected) {
      throw new Error("MongoDB is not connected");
    }
    return this.connection.db;
  }

  isConnected(): boolean {
    return this.connection?.isConnected ?? false;
  }
}
