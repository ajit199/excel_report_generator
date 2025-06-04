import { Job } from "bullmq";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";
import { ReportRequestBody } from "../routes/reportRequest";

export const reportJobHandler = async (job: Job<ReportRequestBody>) => {
  try {
    const { numberOfSheets, rowsPerSheet } = job.data;

    const filePath = path.join(
      __dirname,
      `../../reports/report_${job.id}.xlsx`
    );

    // Ensure folder exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: filePath,
      useStyles: true,
    });

    const columns = [
      { header: "Reviewer Name", key: "name", width: 25 },
      { header: "Platform", key: "platform", width: 15 },
      { header: "Rating", key: "rating", width: 10 },
      { header: "Reviewer Comment", key: "comment", width: 50 },
      { header: "Review Date", key: "date", width: 20 },
    ];

    for (let i = 0; i < numberOfSheets; i++) {
      const sheet = workbook.addWorksheet(`Sheet ${i + 1}`);
      sheet.columns = columns;

      for (let j = 0; j < rowsPerSheet; j++) {
        const rating = faker.number.int({ min: 1, max: 5 });
        const row = sheet.addRow({
          name: faker.person.fullName(),
          platform: faker.helpers.arrayElement(["google", "facebook", "yelp"]),
          rating,
          comment: faker.lorem.words(faker.number.int({ min: 10, max: 100 })),
          date: faker.date.past({ years: 2 }).toLocaleDateString(),
        });

        // set the color of each row based on rating
        const color =
          rating <= 2 ? "FFCCCC" : rating === 3 ? "FFFFCC" : "CCFFCC";
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color },
          };
        });

        if (j % 100 === 0) {
          const progress = Math.ceil(
            ((i * rowsPerSheet + j) / (numberOfSheets * rowsPerSheet)) * 100
          );
          await job.updateProgress(progress);
        }
        row.commit();
      }
      sheet.commit();
    }

    await workbook.commit();
    console.log(`✅ File saved to ${filePath}`);
    return { filePath };
  } catch (error) {
    console.log(
      `Error in report job handler while processing job id ${job.id} :`,
      error
    );
  }
};
