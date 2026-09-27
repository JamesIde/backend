import "dotenv/config";
import { z } from "zod";
import logger from "./middleware/logger";

const EnvSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number(),
    DB_NAME: z.string(),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number().default(1433),
  })
  .loose();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ message: "Invalid environment variables", err: parsed.error });
  throw new Error("Invalid environment variables see stack trace for details");
}

export const env = parsed.data;
