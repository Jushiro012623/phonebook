import {body, ValidationChain} from "express-validator";
import {PrismaService} from "@app/services/prisma.service";

const prisma = new PrismaService();

export const CreateUserSchema: ValidationChain[] = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .custom(async (value) => {
      const user = await prisma.user.findUnique({where: {username: value}});
      if (user) {
        throw new Error('This email address is already in use.');
      }
      return true;
    }),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid email address')
    .custom(async (value) => {
      const user = await prisma.user.findUnique({where: {email: value}});
      if (user) {
        throw new Error('This username is already in use.');
      }
      return true;
    }),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min: 8}).withMessage('Password must be at least 8 characters'),

  body("confirmPassword")
    .custom((value, {req}) => value === req.body.password).withMessage("Passwords don't match")
];
