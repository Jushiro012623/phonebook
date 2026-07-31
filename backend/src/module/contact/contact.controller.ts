import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Patch,
  Validate,
} from "@app/decorators";
import {Request, Response} from "express";
import {ApiResponse, HTTPResponse} from "@app/response";
import {ContactService} from "@app/module/contact/contact.service";
import {JwtService} from "@app/services/jwt.service";
import AppError from "@app/exceptions/app-error";
import {
  CreateContactValidation,
  UpdateContactValidation,
  GetContactValidation,
  DeleteContactValidation,
} from "@app/module/contact/contact.validation";

@Controller("/contacts")
export class ContactController {
  @Inject(ContactService)
  private readonly service!: ContactService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  private extractUserId(req: Request): number {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header is missing", 401);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    try {
      const decoded = this.jwtService.verify<{ sub: string }>(token);
      return parseInt(decoded.sub, 10);
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }

  @Post("/")
  @Validate(CreateContactValidation)
  async createContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const contact = await this.service.createContact(req, userId);

    return ApiResponse.success(
      res,
      "Contact created successfully",
      contact,
      HTTPResponse.CREATED
    );
  }

  @Get("/")
  async getContacts(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const query = (req.query.q as string) || "";

    let contacts;
    if (query) {
      contacts = await this.service.searchContacts(userId, query);
    } else {
      contacts = await this.service.getContactsByUserId(userId);
    }

    return ApiResponse.success(
      res,
      "Contacts retrieved successfully",
      contacts
    );
  }

  @Get("/:contactId")
  @Validate(GetContactValidation)
  async getContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const {contactId} = req.params as { contactId: string };

    const contact = await this.service.getContactById(contactId);

    if (!contact) {
      throw new AppError("Contact not found", 404);
    }

    // Verify ownership or shared access
    if (contact.userId !== userId) {
      throw new AppError("You don't have access to this contact", 403);
    }

    return ApiResponse.success(
      res,
      "Contact retrieved successfully",
      contact
    );
  }

  @Patch("/:contactId")
  @Validate(UpdateContactValidation)
  async updateContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const {contactId} = req.params as { contactId: string };

    const contact = await this.service.updateContact(req, contactId, userId);

    return ApiResponse.success(
      res,
      "Contact updated successfully",
      contact
    );
  }

  @Delete("/:contactId")
  @Validate(DeleteContactValidation)
  async deleteContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const {contactId} = req.params as { contactId: string };

    await this.service.deleteContact(contactId, userId);

    return ApiResponse.success(res, "Contact deleted successfully");
  }
}
