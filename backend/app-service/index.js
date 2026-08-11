import express from 'express';
import dotenv from 'dotenv';
import webhookRoute from './routes/webhook.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});