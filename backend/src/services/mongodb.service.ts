import config from "@app/config/config";
import {Injectable} from "@app/decorators";
import {
  MongoClient,
  Collection,
  Document,
} from "mongodb";

@Injectable()
export class MongoDBService {
  private readonly client = new MongoClient(config.mongodb.uri);

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  collection<T extends Document = Document>(
    name: string
  ): Collection<T> {
    return this.client
      .db(config.mongodb.database)
      .collection<T>(name);
  }
}
