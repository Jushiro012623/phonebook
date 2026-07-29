import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import ValidationException from "../exceptions/validation-exception";

export function Validate(schemas: any[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      await Promise.all(schemas.map(schema => schema.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const valdiationError = errors.array().map((e: any) => ({field: e.path, message: e.msg}))
        throw new ValidationException("Validation Failed", valdiationError)

      }
      return originalMethod.call(this, req, res, next);
    };
  };
}
