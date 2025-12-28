// src/server.ts

import express = require("express");
import { route } from "./router";
import { execute } from "./execute";

const app = express();
app.use(express.json({ limit: "10mb" }));

/* --------------------------------------------------
   /route : DÉCISION (DEBUG)
-------------------------------------------------- */
app.post("/route", (req, res) => {
  try {
    const decision = route(req.body);
    res.json({
      ok: true,
      decision
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

/* --------------------------------------------------
   /execute : EXÉCUTION RÉELLE (IA)
-------------------------------------------------- */
app.post("/execute", async (req, res) => {
  try {
    const result = await execute(req.body);
    res.json({
      ok: true,
      result
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

/* --------------------------------------------------
   HEALTHCHECK
-------------------------------------------------- */
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    status: "up"
  });
});

/* --------------------------------------------------
   SERVER START
-------------------------------------------------- */
app.listen(3333, "0.0.0.0", () => {
  console.log("🚀 MCP Hub running on http://0.0.0.0:3333");
  console.log("Endpoints:");
  console.log("  POST /route");
  console.log("  POST /execute");
  console.log("  GET  /health");
});
