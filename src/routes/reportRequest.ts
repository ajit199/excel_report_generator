import { Request, Response, Router } from "express";
import { reportQueue } from "../index";

const reportRequestRouter = Router();

interface ReportRequestBody {
  numberOfSheets: number;
  rowsPerSheet: number;
}

reportRequestRouter.post(
  "/",
  async (
    req: Request<{}, {}, ReportRequestBody>,
    res: Response
  ): Promise<any> => {
    const { numberOfSheets, rowsPerSheet } = req.body;

    if (!numberOfSheets || !rowsPerSheet) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const job = await reportQueue.add("generate-report", {
      numberOfSheets,
      rowsPerSheet,
    });

    res.json({ jobId: job.id });
  }
);
export { reportRequestRouter };
