import { defineConfig } from "drizzle-kit";
import { env } from "./config/env.js";

export default defineConfig({
  schema: "./database/schema/*",
  out: "./database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});