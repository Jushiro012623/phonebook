import dotenv from "dotenv";

dotenv.config();

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
    expiry: string
  }
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
    expiry: process.env.JWT_EXPIRES_IN ?? "30m"
  }
};

export default config;
