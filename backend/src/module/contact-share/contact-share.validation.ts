import { body, param, ValidationChain } from "express-validator";

export const ShareContactValidation: ValidationChain[] = [
  body("contactId")
    .notEmpty()
    .withMessage("Contact ID is required")
    .isString()
    .withMessage("Contact ID must be a string"),

  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required")
    .isInt({ min: 1 })
    .withMessage("Recipient ID must be a positive integer"),
];

export const UnshareContactValidation: ValidationChain[] = [
  body("contactShareId")
    .notEmpty()
    .withMessage("Contact share ID is required")
    .isInt({ min: 1 })
    .withMessage("Contact share ID must be a positive integer"),
];

export const GetContactShareByIdValidation: ValidationChain[] = [
  param("shareId")
    .notEmpty()
    .withMessage("Share ID is required")
    .isInt({ min: 1 })
    .withMessage("Share ID must be a positive integer"),
];
