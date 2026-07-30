import {Inject, Injectable} from "@app/decorators";
import {Request, Response} from "express";
import {HashService} from "@app/services/hash.service";
import {PrismaService} from "@app/services/prisma.service";
import {generateSecureOTP, generateString, sendPasswordReset} from "@app/utils/utils";
import AppError from "@app/exceptions/app-error";
import {JwtService} from "@app/services/jwt.service";
import {User} from "@app/generated/prisma/client";
import {createHmac, randomUUID, timingSafeEqual} from "node:crypto";
import {MailService} from "@app/services/mailer.service";
import config from "@app/config/config";

@Injectable()
export class AuthService {

  @Inject(HashService)
  private readonly hashService!: HashService;

  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  @Inject(JwtService)
  private readonly jwtService!: JwtService;

  @Inject(MailService)
  private readonly mailService!: MailService;

  async signIn(req: Request) {
    const {password, username} = req.body

    const identifier = username.includes("@")
      ? {email: username}
      : {username};

    const user: User | null = await this.prisma.user.findUnique({where: identifier})

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!(await this.hashService.compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== 'APPROVED') {
      throw new AppError(`Your account is currently ${user.status.toLowerCase()}.`, 403);
    }

    const accessToken = this.jwtService.sign({type: "access", jti: randomUUID({}), sub: user.id});
    return {accessToken, user,};
  }

  async signUp(req: Request): Promise<User> {
    const {username, email, password} = req.body;

    const hashedPassword = await this.hashService.hash(password);

    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName: generateString(10),
        lastName: generateString(10),
      },
    });
  }

  async forgotPassword(req: Request) {
    const {email} = req.body;

    const user = await this.prisma.user.findUnique({where: {email}});

    if (!user) {
      return {reference: "", token: "", expiresIn: 900,};
    }

    const reference = `PBFPOTP${generateString(10).toUpperCase()}`;
    const otp = generateSecureOTP(6);
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const tokenType = "password-reset-request"
    const proof = createHmac("sha256", config.jwt.key)
      .update(`${user.id}.${reference}.${otp}.${expiresAt}.${tokenType}`)
      .digest("hex");

    const token = this.jwtService.sign({
        type: tokenType,
        sub: user.id,
        ref: reference,
        expAt: expiresAt,
        proof,
      },
      "5m");

    // void sendPasswordReset(this.mailService, user.email, otp, reference)

    return {
      reference,
      token,
      expiresIn: 900,
      ...(config.nodeEnv === "development" && {otp}),
    };
  }

  async verifyEmail(req: Request) {
    const {reference, otp} = req.body;
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "")

    if (!token) {
      throw new AppError("Invalid password reset token.", 400);
    }

    let payload: {
      sub: string;
      ref: string;
      expAt: number;
      proof: string;
      type: string;
    };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new AppError("OTP has expired or is invalid.", 400);
    }

    if (payload.type !== "password-reset-request") {
      throw new AppError("Invalid password reset request token.", 400);
    }

    if (payload.expAt < Date.now()) {
      throw new AppError("The verification code has expired. Please request a new one.", 400);
    }

    const expectedProof = createHmac("sha256", config.jwt.key)
      .update(`${payload.sub}.${reference}.${otp}.${payload.expAt}.password-reset-request`)
      .digest("hex");

    const isValid = timingSafeEqual(
      Buffer.from(expectedProof, "hex"),
      Buffer.from(payload.proof, "hex")
    );

    if (!isValid) {
      throw new AppError("The verification code you entered is incorrect.", 400);
    }

    const resetToken = this.jwtService.sign(
      {
        type: "password-reset",
        sub: payload.sub,
        ref: payload.ref,
      },
      "5m"
    );

    return {
      verified: true,
      resetToken,
      expiresIn: 300,
    };
  }

  async changePassword(req: Request) {
    const {password} = req.body;

    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new AppError("Password reset token is required.", 400);
    }

    let payload: {
      sub: string;
      type: string;
    };

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new AppError("Password reset token has expired or is invalid.", 400);
    }

    if (payload.type !== "password-reset") {
      throw new AppError("Invalid password reset token.", 400);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(payload.sub),
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const hashedPassword = await this.hashService.hash(password, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      changed: true,
    };
  }

}
