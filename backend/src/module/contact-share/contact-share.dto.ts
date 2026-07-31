import { ContactShare } from "@app/generated/prisma/client";

export class ContactShareResponseDto {
  id: number;
  contactId: string;
  ownerId: number;
  userId: number;
  createdAt: Date;
  owner?: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  user?: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  constructor(contactShare: ContactShare & {
    owner?: any;
    user?: any;
  }) {
    this.id = contactShare.id;
    this.contactId = contactShare.contactId;
    this.ownerId = contactShare.ownerId;
    this.userId = contactShare.userId;
    this.createdAt = contactShare.createdAt;
    this.owner = contactShare.owner;
    this.user = contactShare.user;
  }
}
