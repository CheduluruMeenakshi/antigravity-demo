import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import advisoriesRouter from './routes/advisories.routes.js';
import fieldsRouter from './routes/fields.routes.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Rate limiter for /api/advisories
const globalAdvisoryLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AgriAdvisor API' });
});

// Routes
app.use('/api/advisories', globalAdvisoryLimit, advisoriesRouter);
app.use('/api/fields', fieldsRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err.message);
  const status = (err as any).status ?? 500;
  res.status(status).json({ error: err.message ?? 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`AgriAdvisor API listening on port ${PORT}`);
});
