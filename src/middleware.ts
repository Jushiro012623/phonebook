import 'reflect-metadata';
import bodyParser from "body-parser";
import {Application, NextFunction, Request, Response} from "express";
import NotFoundException from "./exceptions/not-found-exception";
import {ApiResponse} from "./response";
import AppError from "./exceptions/app-error";

class AppMiddleware {

  readonly app: Application;

  private controller = []

  constructor(app: Application) {
    this.app = app
  }

  public parser() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
  }

  public security() {

  }

  public routes() {

    this.router(this.app, this.controller)

    this.app.all("/{*splat}", () => {
      throw new NotFoundException('Route not found')
    });

    this.app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof AppError) {
        return ApiResponse.fail(
          req,
          res,
          err.message,
          err.details,
          err.status,
          err.title
        );
      }
      console.error(err);
      return ApiResponse.fail(req, res, 'Internal Server Error', {}, 500);
    });
  }

  private router(app: any, controllers: any[]) {
    controllers.forEach((ControllerClass) => {
      const instance = new ControllerClass();
      const prefix = Reflect.getMetadata('prefix', ControllerClass);
      const routes = Reflect.getMetadata('routes', ControllerClass) || [];
      routes.forEach((route: any) => {
        app[route.method](
          `${prefix}${route.path}`,
          instance[route.handlerName].bind(instance)
        );
      });
    });
  }

}

export default AppMiddleware
