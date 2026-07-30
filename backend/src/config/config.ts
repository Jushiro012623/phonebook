import dotenv from "dotenv";
import {SignOptions} from "jsonwebtoken";

dotenv.config();

export type JwtExpiry = Exclude<SignOptions["expiresIn"], undefined>;

interface Config {
  port: number;
  nodeEnv: string;

  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };

  jwt: {
    key: string;
    expiry: JwtExpiry;
  }

  mail: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    from: string;
  };
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_DATABASE || "",
  },

  jwt: {
    key: process.env.DB_HOST!,
    expiry: (process.env.JWT_EXPIRES_IN ?? "30m") as JwtExpiry,
  },

  mail: {
    host: process.env.SMTP_SERVER_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_SERVER_PORT) || 587,
    secure: process.env.SMTP_SERVER_SECURE === "true",
    username: process.env.SMTP_SERVER_USERNAME ?? "",
    password: process.env.SMTP_SERVER_PASSWORD ?? "",
    from: process.env.SMTP_SERVER_SENDER ?? "",
  },
};

export default config;
