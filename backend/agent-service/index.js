import express from "express";
import dotenv from "dotenv";
import router from "./router/agent.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/agents',router);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});