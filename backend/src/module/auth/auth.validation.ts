import {body, ValidationChain} from "express-validator";

export const LoginUserValidation: ValidationChain[] = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const ForgotPasswordValidation: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid email address"),
];

export const VerifyEmailValidation: ValidationChain[] = [
  body("otp").notEmpty().withMessage("OTP is required").isLength({min: 6, max: 6}),

  body("reference").notEmpty().withMessage("Reference Number is required"),
];
