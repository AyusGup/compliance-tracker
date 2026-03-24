import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan(ENV === 'dev' ? 'dev' : 'combined'));
app.use(express.json());

// Default Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'compliance-tracker-api',
    environment: ENV 
  });
});

app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
