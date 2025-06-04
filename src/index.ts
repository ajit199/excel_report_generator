import express from "express";
import { Queue, Worker } from "bullmq";
import { reportJobHandler } from "./jobs/reportGenerator";
import { reportStatusRouter } from "./routes/reportStatus";
import { reportRequestRouter } from "./routes/reportRequest";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// Redis Connection
// const connection = createClient({ url: 'redis://localhost:6379' });
// connection.connect();
const connection = { host: "127.0.0.1", port: 6379 };
export const reportQueue = new Queue("report-queue", {
  connection,
});

// Worker to handle background jobs
new Worker("report-queue", reportJobHandler, { connection });

// Routes
app.use("/generate-report", reportRequestRouter);
app.use("/report-status", reportStatusRouter);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
