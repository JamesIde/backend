import { createLogger, format, transports } from "winston";
import type { TransformableInfo } from "logform";

type RequestLogInfo = TransformableInfo & {
  reqId?: string;
  method?: string;
  path?: string;
  body?: unknown;
  err?: { cause?: string; stack?: string; message?: string };
};

function devFormat(info: RequestLogInfo): string {
  const requestMetaData = Object.entries({
    requestId: info.reqId,
    method: info.method,
    path: info.path,
    body: info.body,
  }).filter(([, v]) => v !== undefined && v !== null);

  const meta =
    requestMetaData.length > 0
      ? JSON.stringify(Object.fromEntries(requestMetaData), null, 2)
      : "";

  const lines = [`${info.timestamp} ${info.level} ${info.message}`];
  if (info.err?.cause) lines.push(`cause: ${info.err.cause}`);
  if (info.err?.stack) lines.push(info.err.stack);
  if (meta) lines.push(meta);

  return lines.join("\r\n");
}

const devLoggerOptions = {
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    format.colorize(),
    format.printf(devFormat),
  ),
  transports: [new transports.Console()],
};

const prodLoggerOptions = {
  level: "info",
  defaultMeta: {
    service: "budget-express-server",
    env: process.env.NODE_ENV,
  },
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    format.json(),
  ),
  transports: [new transports.Console()],
};

const winstonLoggerOptions =
  process.env.NODE_ENV !== "production" ? devLoggerOptions : prodLoggerOptions;

const logger = createLogger(winstonLoggerOptions);
export default logger;
