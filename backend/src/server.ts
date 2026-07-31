import ExpressApp from "@app/app";
import { MongoDBService } from "@app/services/mongodb.service";
import config from '@app/config/config'

const app = new ExpressApp();
const mongoService = new MongoDBService();

async function startServer() {
  try {
    await mongoService.connect();

    app.start().listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
