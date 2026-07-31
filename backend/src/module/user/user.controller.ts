import {Controller, Delete, Get, Inject, Patch, Post, Validate} from "@app/decorators";
import {ApiResponse} from "@app/response";
import {Response, Request} from 'express'
import {UserService} from "@app/module/user/user.service";
import {CreateUserSchema, UpdateUserSchema} from "@app/module/user/user.validator";

@Controller("/users")
export class UserController {

  @Inject(UserService)
  private readonly service!: UserService;

  @Get("/")
  async findAll(req: Request, res: Response) {
    const users = await this.service.findAll();

    return ApiResponse.success(
      res,
      "Users retrieved successfully.",
      users
    );
  }

  @Get("/:id")
  async findOne(req: Request, res: Response) {
    const id = Number(req.params.id);

    const user = await this.service.findById(id);

    return ApiResponse.success(
      res,
      "User retrieved successfully.",
      user
    );
  }

  @Post("/")
  @Validate(CreateUserSchema)
  async create(req: Request, res: Response) {
    const {username, email, password, firstName, lastName} = req.body as {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    const user = await this.service.create({username, email, password, firstName, lastName});

    return ApiResponse.success(res, "User created successfully.", user, 201);
  }

  @Patch("/:id")
  @Validate(UpdateUserSchema)
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    const user = await this.service.update(id, req.body);

    return ApiResponse.success(res, "User updated successfully.", user);
  }

  @Delete("/:id")
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    await this.service.delete(id);

    return ApiResponse.success(res, "User deleted successfully.");
  }
}

