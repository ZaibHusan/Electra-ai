import express from "express";
import dotenv from "dotenv";
import router from "./router/agent.router.js";
import { connectMongoose } from "./config/mongoose.db.js";
import ragRoutes from "./router/rag.routes.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World! i am Agent Service and this is me Mr zaib who modified this");
});

app.use('/api/agents', router);
app.use('/api/rag', ragRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'app-service' });
})

// 3. Open the gates to traffic
app.listen(PORT, () => {
  connectMongoose();
  console.log(`Server is running on port ${PORT}`);
});