import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import ValidationException from "@app/exceptions/validation-exception";

export function Validate(schemas: any[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      await Promise.all(schemas.map(schema => schema.run(req)));

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const validationErrors = Object.values(
          errors.array().reduce(
            (acc, error: any) => {
              let field = acc[error.path];

              if (!field) {
                field = {
                  field: error.path,
                  message: [],
                };
                acc[error.path] = field;
              }

              field.message.push(error.msg);

              return acc;
            },
            {} as Record<string, { field: string; message: string[] }>
          )
        );

        throw new ValidationException("Validation Failed", validationErrors);
      }

      return originalMethod.call(this, req, res, next);
    };
  };
}
