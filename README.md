
# 📊 Excel Report Generator with BullMQ and ExcelJS

A scalable Node.js + TypeScript backend service to generate large Excel reports in the background using BullMQ and Redis.

## 🚀 Features

- Queue-based Excel report generation using BullMQ
- Stream-based Excel file creation with ExcelJS (up to 100,000 rows per sheet)
- Conditional formatting based on review rating
- Progress tracking via API
- Modular and type-safe Express + TypeScript architecture

## 🛠 Setup & Installation

### 1. Clone the Repository

````bash
git clone https://github.com/ajit199/excel_report_generator.git
cd excel_report_generator
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Redis using Redis Stack (Recommended)

This project uses the Redis Stack Docker image, which includes Redis and RedisInsight:

```bash
docker run -d -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

### 4. Build Reports Directory (Optional)

```bash
mkdir -p reports
```

---

## ▶️ How to Run the Project

### 1. Start the Development Server

```bash
npm run dev
```

> This runs the project with `ts-node-dev` for hot reloading.

---

## 📡 API Endpoints

### ✅ Generate Report

**POST** `/generate-report`

**Request Body:**

```json
{
  "numberOfSheets": 5,
  "rowsPerSheet": 10000
}
```

> ⚠️ Limits: `numberOfSheets` ≤ 10, `rowsPerSheet` ≤ 100000

---

### 📊 Check Job Status

**GET** `/report-status/:jobId`

**Response:**

```json
{
  "state": "active" | "completed" | "failed",
  "progress": 42%,
  "fileUrl": "https://s3.amazonaws.com/bucket/report-123.xlsx" // only if completed
}
```

---

## 📂 Technologies Used

* Node.js + TypeScript
* Express.js
* BullMQ + Redis
* ExcelJS (streaming writer)
* Faker.js (mock data generation)

---

## 📦 Build for Production

```bash
npm run build
```
