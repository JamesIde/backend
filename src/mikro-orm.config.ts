import { BaseEntity, defineConfig } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { MsSqlDriver } from "@mikro-orm/mssql";
import { SeedManager } from "@mikro-orm/seeder";
import { UserSchema } from "./entities/user";
import { env } from "./config";

export default defineConfig({
  debug: true,
  extensions: [Migrator, SeedManager],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
  },
  entities: [
    // Same order as they are listed in /entities
    BaseEntity,
    UserSchema,
  ],
  driver: MsSqlDriver,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
  driverOptions: {
    server: env.DB_HOST,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
});
