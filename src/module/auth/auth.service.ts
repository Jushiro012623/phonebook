import {Inject, Injectable} from "@app/decorators";
import {Request, Response} from "express";
import {User} from "@app/generated/client";
import {HashService} from "@app/services/hash.service";
import {PrismaService} from "@app/services/prisma.service";
import {generateString} from "@app/utils/utils";
import AppError from "@app/exceptions/app-error";
import {JwtService} from "@app/services/jwt.service";

@Injectable()
export class AuthService {

  @Inject(HashService)
  private readonly hashService!: HashService;

  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  async signIn(req: Request) {
    const {password, username: identifier} = req.body

    const user: User | null = await this.prisma.user.findFirst({
      where: {
        OR: [
          {email: identifier},
          {username: identifier},
        ],
      },
    })

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await this.hashService.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }
    const accessToken = this.jwtService.sign({});
    return {
      accessToken,
      user,
    };
  }

  async signUp(req: Request, res: Response): Promise<User> {
    const {username, email, password} = req.body
    const hashedPassword = await this.hashService.hash(password)
    const firstName = generateString(10);
    const lastName = generateString(10);

    return this.prisma.user.create({
      data: {username, email, firstName, lastName, password: hashedPassword},
    });
  }
}
