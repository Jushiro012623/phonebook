import express, {Application} from 'express';
import AppMiddleware from './middleware';

class ExpressApp {

  readonly app: Application
  readonly middleware: AppMiddleware

  constructor() {
    this.app = express()
    this.middleware = new AppMiddleware(this.app)
  }

  public start() {
    this.middleware.security()
    this.middleware.parser()
    this.middleware.routes()
    this.handle()
    return this.app;
  }

  private handle() {
    process.on('uncaughtException', (error: Error) => {
      console.error(`There was an uncaught error: ${error}`);
      ExpressApp.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: Error) => {
      console.error(`Unhandled rejection at promise: ${reason}`);
      ExpressApp.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      console.error('Caught SIGTERM');
      ExpressApp.shutDownProperly(2);
    });

    process.on('SIGINT', () => {
      console.error('Caught SIGINT');
      ExpressApp.shutDownProperly(2);
    });

    process.on('exit', () => {
      console.error('Exiting');
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        console.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        console.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

export default ExpressApp
