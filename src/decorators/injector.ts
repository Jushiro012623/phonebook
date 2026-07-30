export const container = new Map<any, any>();

export function Injectable() {
  return function (target: any) {
    container.set(target, new target());
  };
}

export function Inject(type: any) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: () => {
        if (!container.has(type)) {
          container.set(type, new type());
        }
        return container.get(type);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
