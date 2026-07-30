import {ApiResponse, HTTPResponse} from "@app/response";
import {Request, Response} from 'express'
import {Controller, Inject, Post, Validate} from "@app/decorators";
import {AuthService} from "@app/module/auth/auth.service";
import {AuthResponseDto} from "./auth-response.dto";
import {User} from "@app/generated/prisma/client";
import {
  ChangePasswordValidation,
  CreateUserSchema,
  ForgotPasswordValidation,
  LoginUserValidation,
  VerifyEmailValidation
} from "@app/module/auth/auth.validation";

@Controller("/auth")
export class AuthController {

  @Inject(AuthService)
  private readonly service!: AuthService

  @Post("/sign-in")
  @Validate(LoginUserValidation)
  async signIn(req: Request, res: Response) {
    const {accessToken, user} = await this.service.signIn(req)
    ApiResponse.success(res, "Logged in", {accessToken, user})
  }

  @Post('/sign-up')
  @Validate(CreateUserSchema)
  async signUp(req: Request, res: Response) {
    const user: User = await this.service.signUp(req)
    ApiResponse.success(res, "Signed In Successfully", new AuthResponseDto(user), HTTPResponse.CREATED)
  }

  @Post('/forgot-password')
  @Validate(ForgotPasswordValidation)
  async forgotPassword(req: Request, res: Response) {
    const token = await this.service.forgotPassword(req)
    ApiResponse.success(res, "OTP sent successfully", token)
  }

  @Post("/verify-email")
  @Validate(VerifyEmailValidation)
  async verifyEmail(req: Request, res: Response) {
    const isVerified = await this.service.verifyEmail(req)
    ApiResponse.success(res, "Verified Successfully", isVerified)
  }

  @Post("/change-password")
  @Validate(ChangePasswordValidation)
  async changePassword(req: Request, res: Response) {
    const isVerified = await this.service.changePassword(req)
    ApiResponse.success(res, "Verified Successfully", isVerified)
  }


}
