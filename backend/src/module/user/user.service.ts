import {Inject, Injectable} from "@app/decorators";
import {PrismaService} from "@app/services/prisma.service";
import AppError from "@app/exceptions/app-error";
import {User} from "@app/generated/prisma/client";
import {HashService} from "@app/services/hash.service";
import {generateString} from "@app/utils/utils";

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(HashService)
  private readonly hashService!: HashService;

  async findAll(): Promise<Partial<User>[]> {
    return this.prisma.user.findMany()
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: {id}
    })

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return user;
  }

  async create(dto: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {

    const hashedPassword = await this.hashService.hash(dto.password);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName ?? generateString(10),
        lastName: dto.lastName ?? generateString(10),
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {email},
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {username},
    });
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: identifier.includes("@")
        ? {email: identifier}
        : {username: identifier},
    });
  }

  async update(id: number, data: Partial<User>,): Promise<Partial<User>> {
    const exists = await this.prisma.user.findUnique({
      where: {id},
    });

    if (!exists) {
      throw new AppError("User not found.", 404);
    }

    return this.prisma.user.update({where: {id}, data,});
  }

  async updatePassword(id: number, password: string,): Promise<void> {
    await this.prisma.user.update({
      where: {id},
      data: {
        password,
      },
    });
  }

  async delete(id: number): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: {id},
      select: {
        id: true,
      },
    });

    if (!exists) {
      throw new AppError("User not found.", 404);
    }

    await this.prisma.user.delete({where: {id},});
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.user.count({where: {id},});

    return count > 0;
  }
}
