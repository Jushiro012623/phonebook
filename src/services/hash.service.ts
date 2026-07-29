import * as bcrypt from 'bcrypt';
import {Injectable} from "@app/decorators";

@Injectable()
export class HashService {
  private readonly SALT_ROUNDS: number = 11;

  async compare(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.SALT_ROUNDS);
  }

}
