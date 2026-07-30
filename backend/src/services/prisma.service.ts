import {Injectable} from "@app/decorators";
import {PrismaClient} from "@app/generated/client";
import {PrismaMariaDb} from "@prisma/adapter-mariadb";
import config from "@app/config/config";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      adapter: new PrismaMariaDb({
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password,
        database: config.database.name,
      }),
    });
  }
}
