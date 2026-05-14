import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
app.use(express.json());

const agent = new https.Agent({
  rejectUnauthorized: false
});

const BASE_URL = "https://220.135.96.155:8443";

async function proxyRequest(req, res, endpoint, method = "POST") {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      agent,
      headers: {
        "Authorization": req.headers.authorization || "",
        "Content-Type": "application/json"
      },
      body: method === "GET" ? undefined : JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}

app.post("/clock", (req, res) => {
  proxyRequest(req, res, "/api/v1/mobile/attendance/clock");
});

app.post("/login", (req, res) => {
  proxyRequest(req, res, "/api/v1/auth/login");
});

app.get("/lookups", (req, res) => {
  proxyRequest(req, res, "/api/v1/mobile/lookups", "GET");
});

app.post("/transactions", (req, res) => {
  proxyRequest(req, res, "/api/v1/transactions");
});

app.listen(3000, () => {
  console.log("Server running");
});
