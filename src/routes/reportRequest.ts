import { Request, Response, Router } from "express";
import { reportQueue } from "../index";

const reportRequestRouter = Router();

export interface ReportRequestBody {
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
    try {
      if (!numberOfSheets || !rowsPerSheet) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      if (numberOfSheets > 10) {
        return res.status(400).json({ error: "Maximum allowed sheets is 10" });
      }

      if (rowsPerSheet > 100000) {
        return res
          .status(400)
          .json({ error: "Maximum allowed rows per sheet is 100000" });
      }

      const job = await reportQueue.add("generate-report", {
        numberOfSheets,
        rowsPerSheet,
      });

      res.json({ jobId: job.id });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);
export { reportRequestRouter };
