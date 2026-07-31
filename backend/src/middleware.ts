import 'reflect-metadata';
import bodyParser from "body-parser";
import {Application, NextFunction, Request, Response} from "express";
import NotFoundException from "@app/exceptions/not-found-exception";
import {ApiResponse} from "@app/response";
import {UserController} from "@app/module/user/user.controller";
import {AuthController} from "@app/module/auth/auth.controller";
import {ContactShareController} from "@app/module/contact-share/contact-share.controller";
import {ContactController} from "@app/module/contact/contact.controller";
import AppError from "@app/exceptions/app-error";
import cors from 'cors'

class AppMiddleware {

  readonly app: Application;

  private controller = [
    UserController,
    AuthController,
    ContactController,
    ContactShareController
  ]

  constructor(app: Application) {
    this.app = app
  }

  public parser() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
  }

  public security() {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }))
    console.log(process.env.FRONTEND_URL)
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
      return ApiResponse.fail(req, res, 'Internal Server Error', {err}, 500);
    });
  }

  private router(app: any, controllers: any[], apiPrefix = "/api") {
    controllers.forEach((ControllerClass) => {
      const instance = new ControllerClass();
      const prefix = Reflect.getMetadata('prefix', ControllerClass);
      const routes = Reflect.getMetadata('routes', ControllerClass) || [];

      routes.forEach((route: any) => {
        const fullPath = `${apiPrefix}${prefix}${route.path}`;
        console.log(
          `[${route.method.toUpperCase()}] ${fullPath} -> ${ControllerClass.name}.${route.handlerName}()`
        );
        app[route.method](
          fullPath,
          instance[route.handlerName].bind(instance)
        );
      });
    });
  }

}

export default AppMiddleware
