import ExpressApp from "./app";
import config from './config/config'

const app = new ExpressApp();

app.start().listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
