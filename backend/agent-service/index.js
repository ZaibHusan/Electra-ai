import express from "express";
import dotenv from "dotenv";
import router from "./router/agent.router.js";
import { connectMongoose } from "./config/mongoose.db.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/agents', router);

// 3. Open the gates to traffic
app.listen(PORT, () => {
  connectMongoose();
  console.log(`Server is running on port ${PORT}`);
});