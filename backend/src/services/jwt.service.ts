import jwt, {JwtPayload, SignOptions} from "jsonwebtoken";
import {Injectable} from "@app/decorators";
import config, {type JwtExpiry} from '@app/config/config'

@Injectable()
export class JwtService {

  sign(payload: object, expiresIn: JwtExpiry = config.jwt.expiry): string {
    return jwt.sign(payload, config.jwt.key, {
      expiresIn,
    });
  }

  verify<T extends JwtPayload = JwtPayload>(token: string): T {
    return jwt.verify(token, config.jwt.key) as T;
  }

  decode<T extends JwtPayload = JwtPayload>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
