import { Inject, Injectable } from "@app/decorators";
import { Request } from "express";
import { PrismaService } from "@app/services/prisma.service";
import { ContactService } from "@app/module/contact/contact.service";
import AppError from "@app/exceptions/app-error";
import { ContactShare } from "@app/generated/prisma/client";

@Injectable()
export class ContactShareService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(ContactService)
  private readonly contactService!: ContactService;

  async shareContact(req: Request, userId: number): Promise<ContactShare> {
    const { contactId, recipientId } = req.body as {
      contactId: string;
      recipientId: number;
    };

    if (!contactId || !recipientId) {
      throw new AppError("contactId and recipientId are required", 400);
    }

    if (userId === recipientId) {
      throw new AppError("Cannot share contact with yourself", 400);
    }

    const contact = await this.contactService.getContactById(contactId);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }

    if (contact.userId !== userId) {
      throw new AppError("You can only share your own contacts", 403);
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw new AppError("Recipient user not found", 404);
    }

    const existingShare = await this.prisma.contactShare.findUnique({
      where: {
        contactId_userId: {
          contactId,
          userId: recipientId,
        },
      },
    });

    if (existingShare) {
      throw new AppError("Contact already shared with this user", 400);
    }

    const contactShare = await this.prisma.contactShare.create({
      data: {
        contactId,
        ownerId: userId,
        userId: recipientId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return contactShare;
  }

  async unshareContact(req: Request, userId: number): Promise<void> {
    const { contactShareId } = req.body as { contactShareId: number };

    if (!contactShareId) {
      throw new AppError("contactShareId is required", 400);
    }

    const contactShare = await this.prisma.contactShare.findUnique({
      where: { id: contactShareId },
    });

    if (!contactShare) {
      throw new AppError("Contact share record not found", 404);
    }

    if (contactShare.ownerId !== userId) {
      throw new AppError(
        "You can only remove shares you have created",
        403
      );
    }

    await this.prisma.contactShare.delete({
      where: { id: contactShareId },
    });
  }

  async getSharedContacts(req: Request, userId: number): Promise<ContactShare[]> {
    const sharedContacts = await this.prisma.contactShare.findMany({
      where: {
        userId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return sharedContacts;
  }

  async getMyShares(req: Request, userId: number): Promise<ContactShare[]> {
    const myShares = await this.prisma.contactShare.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return myShares;
  }

  async getContactShareById(
    req: Request,
    userId: number
  ): Promise<ContactShare> {
    const { shareId } = req.params as { shareId: string };

    if (!shareId) {
      throw new AppError("shareId is required", 400);
    }

    const contactShare = await this.prisma.contactShare.findUnique({
      where: { id: Number(shareId) },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!contactShare) {
      throw new AppError("Contact share not found", 404);
    }

    // Verify user owns or has access to this share
    if (contactShare.ownerId !== userId && contactShare.userId !== userId) {
      throw new AppError("You don't have access to this share", 403);
    }

    return contactShare;
  }
}
