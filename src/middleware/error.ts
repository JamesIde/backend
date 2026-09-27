import { ErrorRequestHandler } from "express";
import { isHttpError } from "http-errors";
import z, { ZodError } from "zod";
import logger from "./logger";

const errorHandler: ErrorRequestHandler = function (error, _req, res, _next) {
  if (error instanceof ZodError) {
    logger.warn("Validation error", { err: { stack: error.stack } });
    return res.status(422).json({ message: z.treeifyError(error) });
  }

  if (isHttpError(error)) {
    if (error.status >= 500) {
      logger.error(error.message, { stack: error.stack, cause: error.cause });
    } else {
      logger.warn(error.message, { stack: error.stack });
    }
    return res.status(error.status).json({
      message: error.expose ? error.message : "Internal server error",
    });
  }

  logger.error(error instanceof Error ? error.message : "Unknown error", {
    stack: error instanceof Error ? error.stack : undefined,
  });
  return res.sendStatus(500);
};

export default errorHandler;
