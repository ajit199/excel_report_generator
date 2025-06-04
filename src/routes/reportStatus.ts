import express, { Request, Response } from "express";
import { reportQueue } from "../index";

export const reportStatusRouter = express.Router();
reportStatusRouter.get(
  "/:jobId",
  async (req: Request<{ jobId: string }>, res: Response): Promise<any> => {
    try {
      const job = await reportQueue.getJob(req.params.jobId);
      if (!job) return res.status(404).json({ error: "Job not found" });

      const progress = job.progress;
      const state = await job.getState();
      const fileUrl = state === "completed" ? job?.returnvalue?.filePath : null;

      res.json({ progress: `${progress}%`, status: state, fileUrl: fileUrl });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);
