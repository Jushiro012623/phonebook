import {Inject, Injectable} from "@app/decorators";
import {Request} from "express";
import {HashService} from "@app/services/hash.service";
import {PrismaService} from "@app/services/prisma.service";
import {generateSecureOTP, generateString} from "@app/utils/utils";
import AppError from "@app/exceptions/app-error";
import {JwtService} from "@app/services/jwt.service";
import {User} from "@app/generated/prisma/client";
import {createHmac, randomUUID, timingSafeEqual} from "node:crypto";
import {MailService} from "@app/services/mailer.service";
import config from "@app/config/config";
import {UserService} from "@app/module/user/user.service";

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

  @Inject(UserService)
  private readonly userService!: UserService

  async signIn(req: Request) {
    const {password, username} = req.body as { password: string; username: string };

    const user = await this.userService.findByIdentifier(username);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await this.hashService.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== "APPROVED") {
      throw new AppError(`Your account is currently ${user.status.toLowerCase()}.`, 403);
    }

    const accessToken = this.jwtService.sign({
      type: "access",
      jti: randomUUID(),
      sub: user.id,
    });

    return {accessToken, user};
  }

  async signUp(req: Request): Promise<User> {
    const {username, email, password} = req.body as {
      username: string;
      email: string;
      password: string;
    };

    return this.userService.create({username, email, password,});
  }

  async forgotPassword(req: Request) {
    const {email} = req.body as { email: string };
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return {reference: "", token: "", expiresIn: 900};
    }

    const reference = `PBFPOTP${generateString(10).toUpperCase()}`;
    const otp = generateSecureOTP(6);
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const tokenType = "password-reset-request";
    const proof = createHmac("sha256", config.jwt.key)
      .update(`${user.id}.${reference}.${otp}.${expiresAt}.${tokenType}`)
      .digest("hex");

    const token = this.jwtService.sign(
      {
        type: tokenType,
        sub: user.id,
        ref: reference,
        expAt: expiresAt,
        proof,
      },
      "5m"
    );

    return {
      reference,
      token,
      expiresIn: 900,
      ...(config.nodeEnv === "development" && {otp}),
    };
  }

  async verifyEmail(req: Request) {
    const {reference, otp} = req.body as { reference: string; otp: string };
    const payload = this.resolveResetTokenPayload(
      req,
      "password-reset-request",
      "OTP has expired or is invalid."
    );

    if (payload.expAt! < Date.now()) {
      throw new AppError("The verification code has expired. Please request a new one.", 400);
    }

    const expectedProof = createHmac("sha256", config.jwt.key)
      .update(`${payload.sub}.${reference}.${otp}.${payload.expAt}.password-reset-request`)
      .digest("hex");

    if (!this.compareProof(expectedProof, payload.proof!)) {
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
      token: resetToken,
      expiresIn: 300,
    };
  }

  async changePassword(req: Request) {
    const {password} = req.body as { password: string };

    const payload = this.resolveResetTokenPayload(req, "password-reset", "Password reset token has expired or is invalid.");

    const user = await this.userService.findById(Number(payload.sub));

    const hashedPassword = await this.hashService.hash(password);

    await this.userService.updatePassword(user.id!, hashedPassword);

    return {changed: true};
  }

  private resolveResetTokenPayload(req: Request, expectedType: string, invalidMessage: string): ResetTokenPayload {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new AppError("Password reset token is required.", 400);
    }

    let payload: ResetTokenPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new AppError(invalidMessage, 400);
    }

    if (payload.type !== expectedType) {
      throw new AppError("Invalid password reset token.", 400);
    }

    return payload;
  }

  private compareProof(expectedProof: string, originalProof: string) {
    if (expectedProof.length !== originalProof.length) {
      return false;
    }

    return timingSafeEqual(Buffer.from(expectedProof, "hex"), Buffer.from(originalProof, "hex"));
  }
}
