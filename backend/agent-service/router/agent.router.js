import express from "express";
import { agentController } from "../controllers/agent.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Agent Service is running!");
});

router.post("/", agentController);

export default router;