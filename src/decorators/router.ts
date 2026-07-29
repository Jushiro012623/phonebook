import 'reflect-metadata';

export const MetadataKeys = {
  PREFIX: Symbol('prefix'),
  ROUTES: Symbol('routes'),
} as const;

export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options';

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string | symbol;
}

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.PREFIX, prefix, target);

    if (!Reflect.hasOwnMetadata(MetadataKeys.ROUTES, target)) {
      Reflect.defineMetadata(
        MetadataKeys.ROUTES,
        Object.freeze([]),
        target
      );
    }
  };
}

function createRouteDecorator(method: HttpMethod) {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const controller = target.constructor;

      const routes: RouteDefinition[] =
        Reflect.getOwnMetadata(MetadataKeys.ROUTES, controller) ?? [];

      const duplicate = routes.find(
        (route) =>
          route.method === method &&
          route.path === path
      );

      if (duplicate) {
        throw new Error(
          `Duplicate route detected: [${method.toUpperCase()}] ${path}`
        );
      }

      const nextRoutes = Object.freeze([
        ...routes,
        {
          method,
          path,
          handlerName: propertyKey,
        },
      ]);

      Reflect.defineMetadata(
        MetadataKeys.ROUTES,
        nextRoutes,
        controller
      );
    };
  };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Patch = createRouteDecorator('patch');
export const Delete = createRouteDecorator('delete');
export const Head = createRouteDecorator('head');
export const Options = createRouteDecorator('options');

export function getControllerPrefix(controller: Function): string {
  return (
    Reflect.getOwnMetadata(MetadataKeys.PREFIX, controller) ?? ''
  );
}

export function getControllerRoutes(controller: Function): readonly RouteDefinition[] {
  return (
    Reflect.getOwnMetadata(MetadataKeys.ROUTES, controller) ?? []
  );
}
