import 'reflect-metadata';

function Controller(prefix: string = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('prefix', prefix, target);
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }
  };
}

interface RouteDefinition {
  path: string;
  method: string;
  handlerName: string;
}

function createRouteDecorator(method: string) {
  return (path: string): MethodDecorator =>
    (target, propertyKey) => {
      if (!Reflect.hasMetadata('routes', target.constructor)) {
        Reflect.defineMetadata('routes', [], target.constructor);
      }
      const routes = Reflect.getMetadata('routes', target.constructor) as RouteDefinition[];
      routes.push({
        method,
        path,
        handlerName: propertyKey as string,
      });
      Reflect.defineMetadata('routes', routes, target.constructor);
    };
}

const Get = createRouteDecorator('get');
const Post = createRouteDecorator('post');
const Put = createRouteDecorator('put');
const Delete = createRouteDecorator('delete');

export {Controller, Get, Post, Put, Delete};
