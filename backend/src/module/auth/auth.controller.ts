import {ApiResponse, HTTPResponse} from "@app/response";
import {Request, Response} from 'express'
import {Controller, Inject, Post, Validate} from "@app/decorators";
import {CreateUserSchema} from "./validation/create-user.validation";
import {User} from "@app/generated";
import {AuthService} from "@app/module/auth/auth.service";
import {AuthResponseDto} from "./dto/auth-response.dto";
import {LoginUserValidation} from "@app/module/auth/validation/login-user.validation";

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
    const user: User = await this.service.signUp(req, res)
    ApiResponse.success(res, "Signed In Successfully", new AuthResponseDto(user), HTTPResponse.CREATED)
  }
}
