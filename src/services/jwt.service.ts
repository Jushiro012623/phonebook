import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
import {Injectable} from "@app/decorators";
import config from '@app/config/config'

@Injectable()
export class JwtService {

  sign(payload: object): string {
    return jwt.sign(payload, config.jwt.key, {
      expiresIn: config.jwt.expiry,
    } as SignOptions);
  }

  verify<T extends JwtPayload = JwtPayload>(token: string): T {
    return jwt.verify(token, config.jwt.key) as T;
  }

  decode<T extends JwtPayload = JwtPayload>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
