import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Validate,
} from "@app/decorators";
import { Request, Response } from "express";
import { ApiResponse, HTTPResponse } from "@app/response";
import { ContactShareService } from "@app/module/contact-share/contact-share.service";
import { ContactShareResponseDto } from "@app/module/contact-share/contact-share.dto";
import {
  ShareContactValidation,
  UnshareContactValidation,
  GetContactShareByIdValidation,
} from "@app/module/contact-share/contact-share.validation";
import { JwtService } from "@app/services/jwt.service";
import AppError from "@app/exceptions/app-error";

@Controller("/contact-shares")
export class ContactShareController {
  @Inject(ContactShareService)
  private readonly service!: ContactShareService;

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
      if (!decoded.sub) {
        throw new AppError("Invalid token", 401);
      }
      return parseInt(decoded.sub);
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }

  @Post("/share")
  @Validate(ShareContactValidation)
  async shareContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const result = await this.service.shareContact(req, userId);

    return ApiResponse.success(
      res,
      "Contact shared successfully",
      new ContactShareResponseDto(result),
      HTTPResponse.CREATED
    );
  }

  @Delete("/unshare")
  @Validate(UnshareContactValidation)
  async unshareContact(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    await this.service.unshareContact(req, userId);

    return ApiResponse.success(res, "Contact unshared successfully");
  }

  @Get("/shared-with-me")
  async getSharedContacts(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const contacts = await this.service.getSharedContacts(req, userId);

    return ApiResponse.success(
      res,
      "Shared contacts retrieved successfully",
      contacts.map((c) => new ContactShareResponseDto(c))
    );
  }

  @Get("/my-shares")
  async getMyShares(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const shares = await this.service.getMyShares(req, userId);

    return ApiResponse.success(
      res,
      "My shares retrieved successfully",
      shares.map((s) => new ContactShareResponseDto(s))
    );
  }

  @Get("/:shareId")
  @Validate(GetContactShareByIdValidation)
  async getContactShareById(req: Request, res: Response) {
    const userId = this.extractUserId(req);
    const share = await this.service.getContactShareById(req, userId);

    return ApiResponse.success(
      res,
      "Contact share retrieved successfully",
      new ContactShareResponseDto(share)
    );
  }
}
