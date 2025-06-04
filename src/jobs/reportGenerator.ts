import { Job } from "bullmq";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

interface ReportJobData {
  numberOfSheets: number;
  rowsPerSheet: number;
}

export const reportJobHandler = async (job: Job<ReportJobData>) => {
  const { numberOfSheets, rowsPerSheet } = job.data;
  const workbook = new ExcelJS.Workbook();

  for (let i = 0; i < numberOfSheets; i++) {
    const sheet = workbook.addWorksheet(`Sheet ${i + 1}`);
    sheet.columns = [
      { header: "Reviewer Name", key: "name", width: 25 },
      { header: "Platform", key: "platform", width: 15 },
      { header: "Rating", key: "rating", width: 10 },
      { header: "Reviewer Comment", key: "comment", width: 50 },
      { header: "Review Date", key: "date", width: 20 },
    ];

    for (let j = 0; j < rowsPerSheet; j++) {
      const rating = faker.number.int({ min: 1, max: 5 });
      const row = sheet.addRow({
        name: faker.person.fullName(),
        platform: faker.helpers.arrayElement(["google", "facebook", "yelp"]),
        rating,
        comment: faker.lorem.words(faker.number.int({ min: 10, max: 100 })),
        date: faker.date.past({ years: 2 }).toLocaleDateString(),
      });

      const color = rating <= 2 ? "FFCCCC" : rating === 3 ? "FFFFCC" : "CCFFCC";
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: color },
        };
      });

      if (j % 100 === 0) {
        const progress =
          ((i * rowsPerSheet + j) / (numberOfSheets * rowsPerSheet)) * 100;
        await job.updateProgress(progress);
      }
    }
  }

  const filePath = path.join(__dirname, `../../reports/report-${job.id}.xlsx`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return { filePath };
};
