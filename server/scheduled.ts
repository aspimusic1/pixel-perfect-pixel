import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { refreshBookScores } from "./getbooked";

export async function bookScoreRefreshHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);

    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const result = await refreshBookScores();

    return res.json({
      ok: true,
      taskUid: user.taskUid,
      ...result,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      error: err.message,
      stack: err.stack,
      context: {
        url: req.originalUrl,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
