import {body, ValidationChain} from "express-validator";
import {PrismaService} from "@app/services/prisma.service";

const prisma = new PrismaService();

export const CreateUserSchema = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({min: 4, max: 30})
    .withMessage("Username must be between 4 and 30 characters.")

    .custom(async (value) => {
      const user = await prisma.user.findUnique({where: {username: value}});
      if (user) {
        throw new Error("This username is already in use.");
      }
      return true;
    }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({min: 8})
    .withMessage("Password must be at least 8 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  body("firstName")
    .optional()
    .trim()
    .isLength({max: 100})
    .withMessage("First name must not exceed 100 characters."),

  body("lastName")
    .optional()
    .trim()
    .isLength({max: 100})
    .withMessage("Last name must not exceed 100 characters."),
];

export const UpdateUserSchema = [
  body("username")
    .optional()
    .trim()
    .isLength({min: 4, max: 30})
    .withMessage("Username must be between 4 and 30 characters."),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(),

  body("firstName")
    .optional()
    .trim()
    .isLength({max: 100})
    .withMessage("First name must not exceed 100 characters."),

  body("lastName")
    .optional()
    .trim()
    .isLength({max: 100})
    .withMessage("Last name must not exceed 100 characters."),

  body("role")
    .optional()
    .isIn(["SUPER_ADMIN", "ADMIN", "USER"])
    .withMessage("Invalid role."),

  body("status")
    .optional()
    .isIn(["PENDING", "APPROVED", "DEACTIVATED"])
    .withMessage("Invalid status."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
];


export const ChangePasswordValidation: ValidationChain[] = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min: 8})
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword")
    .custom((value, {req}) => value === req.body.password)
    .withMessage("Passwords don't match"),
];

