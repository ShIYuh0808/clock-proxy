import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();

app.use(express.json());

const agent = new https.Agent({
  rejectUnauthorized: false
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    const response = await fetch(
      "https://220.135.96.155:8443/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body),
        agent
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// CLOCK
app.post("/clock", async (req, res) => {
  try {
    const response = await fetch(
      "https://220.135.96.155:8443/api/v1/mobile/attendance/clock",
      {
        method: "POST",
        headers: {
          "Authorization": req.headers.authorization,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body),
        agent
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// TRANSACTIONS
app.post("/transactions", async (req, res) => {
  try {
    const response = await fetch(
      "https://220.135.96.155:8443/api/v1/transactions",
      {
        method: "POST",
        headers: {
          "Authorization": req.headers.authorization,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body),
        agent
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


app.listen(3000, () => {
  console.log("Server running");
});
