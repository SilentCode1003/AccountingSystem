// import "dotenv/config";
import type { Config } from "drizzle-kit";
import "dotenv";

export default {
  schema: "./src/database/schema/*",

  out: "./src/database/drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME as string,
  },
} satisfies Config;
