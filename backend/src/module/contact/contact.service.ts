import { Inject, Injectable } from "@app/decorators";
import { Request } from "express";
import { MongoDBService } from "@app/services/mongodb.service";
import AppError from "@app/exceptions/app-error";
import { ObjectId } from "mongodb";

export interface Contact {
  _id?: ObjectId | undefined;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | undefined;
  company?: string | undefined;
  notes?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ContactService {
  @Inject(MongoDBService)
  private readonly mongoService!: MongoDBService;

  private getContactsCollection() {
    const db = this.mongoService.getDb();
    return db.collection("contacts");
  }

  async createContact(req: Request, userId: number): Promise<Contact> {
    const { firstName, lastName, email, phone, address, company, notes } =
      req.body as Partial<Contact>;

    if (!firstName || !lastName || !email || !phone) {
      throw new AppError(
        "firstName, lastName, email, and phone are required",
        400
      );
    }

    const contactsCollection = this.getContactsCollection();

    const contact: Contact = {
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      company,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await contactsCollection.insertOne(contact);

    return {
      ...contact,
      _id: result.insertedId,
    };
  }

  async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const objectId = new ObjectId(contactId);
      const contactsCollection = this.getContactsCollection();

      const contact = await contactsCollection.findOne({ _id: objectId });

      return contact as Contact | null;
    } catch (error) {
      throw new AppError("Invalid contact ID format", 400);
    }
  }

  async getContactsByUserId(userId: number): Promise<Contact[]> {
    const contactsCollection = this.getContactsCollection();

    const contacts = await contactsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return contacts as Contact[];
  }

  async updateContact(
    req: Request,
    contactId: string,
    userId: number
  ): Promise<Contact> {
    try {
      const objectId = new ObjectId(contactId);
      const contactsCollection = this.getContactsCollection();

      // Verify ownership
      const existingContact = await contactsCollection.findOne({
        _id: objectId,
        userId,
      });

      if (!existingContact) {
        throw new AppError("Contact not found or you don't have access", 404);
      }

      const updateData = req.body as Partial<Contact>;
      updateData.updatedAt = new Date();

      const result = await contactsCollection.findOneAndUpdate(
        { _id: objectId, userId },
        { $set: updateData },
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new AppError("Failed to update contact", 500);
      }

      return result.value as Contact;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid contact ID format", 400);
    }
  }

  async deleteContact(contactId: string, userId: number): Promise<void> {
    try {
      const objectId = new ObjectId(contactId);
      const contactsCollection = this.getContactsCollection();

      const result = await contactsCollection.deleteOne({
        _id: objectId,
        userId,
      });

      if (result.deletedCount === 0) {
        throw new AppError("Contact not found or you don't have access", 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid contact ID format", 400);
    }
  }

  async searchContacts(
    userId: number,
    query: string
  ): Promise<Contact[]> {
    const contactsCollection = this.getContactsCollection();

    const contacts = await contactsCollection
      .find({
        userId,
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return contacts as Contact[];
  }

  async deleteAllUserContacts(userId: number): Promise<number> {
    const contactsCollection = this.getContactsCollection();

    const result = await contactsCollection.deleteMany({ userId });

    return result.deletedCount;
  }
}
