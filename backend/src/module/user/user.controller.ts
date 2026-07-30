import {Controller, Get} from "../../decorators/router";
import {ApiResponse} from "../../response";
import {Response, Request} from 'express'

@Controller("/users")
export class UserController {
  @Get('/')
  findAll(req: Request, res: Response) {
    ApiResponse.success(res, "HELLO FROM USER")
  }
}

