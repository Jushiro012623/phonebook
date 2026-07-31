import { body, param, ValidationChain } from "express-validator";

export const CreateContactValidation: ValidationChain[] = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone must be a string"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),

  body("company")
    .optional()
    .isString()
    .withMessage("Company must be a string"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

export const UpdateContactValidation: ValidationChain[] = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be valid"),

  body("phone")
    .optional()
    .isString()
    .withMessage("Phone must be a string"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),

  body("company")
    .optional()
    .isString()
    .withMessage("Company must be a string"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

export const GetContactValidation: ValidationChain[] = [
  param("contactId")
    .notEmpty()
    .withMessage("Contact ID is required"),
];

export const DeleteContactValidation: ValidationChain[] = [
  param("contactId")
    .notEmpty()
    .withMessage("Contact ID is required"),
];
