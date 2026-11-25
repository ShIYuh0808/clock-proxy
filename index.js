
import express from "express";
import fetch from "node-fetch";
import https from "https";
import { randomUUID } from "node:crypto";

const app = express();
app.use(express.json());

const agent = new https.Agent({
  rejectUnauthorized: false
});

const BASE_URL = "https://220.135.96.155:8443";

async function proxyRequest(
  req,
  res,
  endpoint,
  method = "POST",
  body = req.body
) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      agent,
      headers: {
        "Authorization": req.headers.authorization || "",
        "Content-Type": "application/json"
      },
      body: method === "GET" ? undefined : JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

// 原有：正常打卡
app.post("/clock", (req, res) => {
  proxyRequest(req, res, "/api/v1/mobile/attendance/clock");
});

// 新增：補打卡申請
app.post("/attendance-corrections", (req, res) => {

  const { event_time, event_type, reason } = req.body;

  // 基本資料檢查
  if (!event_time || !event_type || !reason?.trim()) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["event_time", "event_type", "reason"]
    });
  }

  // 限制打卡類型
  if (!["clock_in", "clock_out"].includes(event_type)) {
    return res.status(400).json({
      error: "Invalid event_type"
    });
  }

  // 自動產生申請識別碼
  const correctionData = {
    event_time,
    event_type,
    reason: reason.trim(),
    request_key: req.body.request_key || randomUUID()
  };

  proxyRequest(
    req,
    res,
    "/api/v1/attendance-corrections",
    "POST",
    correctionData
  );
});

// 原有：登入
app.post("/login", (req, res) => {
  proxyRequest(req, res, "/api/v1/auth/login");
});

// 原有：取得選單資料
app.get("/lookups", (req, res) => {
  proxyRequest(req, res, "/api/v1/mobile/lookups", "GET");
});

// 原有：交易紀錄
app.post("/transactions", (req, res) => {
  proxyRequest(req, res, "/api/v1/transactions");
});

app.listen(3000, () => {
  console.log("Server running");
});
