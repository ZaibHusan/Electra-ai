import express from "express";
import { agentController } from "../controllers/agent.controller.js";
import ingestDoc from "../controllers/rag.ingestion.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Agent Service is running!");
});

router.post("/", agentController);
router.post("/ingest", ingestDoc);

export default router;