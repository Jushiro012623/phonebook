import {body, ValidationChain} from "express-validator";

export const LoginUserValidation: ValidationChain[] = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string'),

  body('password')
    .notEmpty().withMessage('Password is required')
];
