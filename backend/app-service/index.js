import express from 'express';
import dotenv from 'dotenv';
import webhookRoute from './routes/webhook.route.js';
import authRoute from './routes/auth.route.js';
import connectDb from './config/mongoose.db.js';
import { errorHandler } from './middleware/error.middleware.js';
import { connectRedis } from './config/redis.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import conversationsRoute from './routes/conversations.route.js';
import { protect } from './middleware/protect.middleware.js';
import { initSocket } from './sockets/socket.js';
import http from 'http';
import promptRoute from './routes/prompt.routes.js';
import adminRagRouter from './routes/admin.rag.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());



const server = http.createServer(app);

initSocket(server);

app.get('/', (req, res) => {
  res.send('Hello, World! i am App Service');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'agent-service'
  });
});

app.use('/api/webhook', webhookRoute);
app.use('/api/auth', authRoute);
app.use('/api/conversations', conversationsRoute);
app.use('/api/prompt', promptRoute);
app.use('/api/admin/rag', adminRagRouter);

app.use(errorHandler);

server.listen(PORT, async () => {
  await connectDb();
  await connectRedis();
  console.log(`🚀 Server running on port ${PORT}`);
});