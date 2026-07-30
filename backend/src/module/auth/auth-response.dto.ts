import {User} from "@app/generated/prisma/client";

export class AuthResponseDto {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    this.isActive = user.isActive;
  }

}
