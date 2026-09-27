import { Router } from "express";
import logger from "../middleware/logger";

const router = Router();

router.get("/", async (_, res) => {
  logger.info("healthy");
  res.status(200).json({ healthCheck: true });
});

export const HealthCheckController = router;
