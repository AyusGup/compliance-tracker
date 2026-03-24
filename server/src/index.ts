import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';

app.use(morgan(ENV==='dev'?'dev':'combined'));
app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
