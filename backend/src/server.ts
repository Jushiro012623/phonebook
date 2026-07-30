import ExpressApp from "@app/app";
import config from '@app/config/config'

const app = new ExpressApp();

app.start().listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
