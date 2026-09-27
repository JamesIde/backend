import "./config.js";
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { MikroORM, EntityManager, RequestContext } from "@mikro-orm/core";
import { env } from "./config.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import { HealthCheckController } from "./controllers/health-check.controller.js";
import { EntityRepository } from "@mikro-orm/mssql";
import { IUser, UserSchema } from "./entities/user.js";
import config from "./mikro-orm.config.js";

// Scaffolded from https://github.com/mikro-orm/express-ts-example-app/tree/master (and SAMS :-))
export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  user: EntityRepository<IUser>;
};

export const app = express();

export const init = (async () => {
  DI.orm = await MikroORM.init(config as any); // TODO
  try {
    logger.info("Attempting to establish connection with the db");
    await DI.orm.connect();
    logger.info("Successfully connected to the db");
  } catch (e) {
    logger.error("Failed to connect to the db", e);
    throw new Error();
  }

  DI.em = DI.orm.em;
  DI.user = DI.orm.em.getRepository(UserSchema);

  // Core middleware
  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(json({ limit: "5mb" }));

  app.use((_, _res, next) => RequestContext.create(DI.orm.em, next));

  // Routes

  app.use("/api/v1/health", HealthCheckController);

  app.get("/", (_, res) => {
    logger.info("Hello World");
    res.status(200).json({ message: "Hello World" });
  });

  app.use(errorHandler);

  DI.server = app.listen(env.PORT, () => {
    logger.info(`[${env.NODE_ENV}] Server is live on ${env.PORT}`);
  });
})();

const shutdown = (signal: string) => {
  logger.info({ message: `Shutting down with signal: ${signal}` });

  DI.server.close(async (err): Promise<void> => {
    if (err) {
      logger.error({ message: "Error closing server", err });
      process.exit(1);
    }
    try {
      await DI.orm.close();
      logger.info({ message: "ORM disconnected" });
    } catch (ormErr) {
      logger.error({ message: "Error disconnecting ORM", err: ormErr });
    } finally {
      process.exit(0);
    }
  });

  setTimeout(() => {
    logger.error({ message: "Forced shutdown timeout" });
    process.exit(1);
  }, 10000).unref();
};

["SIGTERM", "SIGINT"].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on("unhandledRejection", (reason) => {
  logger.error({
    message: "unhandledRejection",
    err: reason instanceof Error ? reason : new Error(String(reason)),
  });
});

process.on("uncaughtException", (err) => {
  logger.error({ message: "uncaughtException", err });
  shutdown("uncaughtException");
});
