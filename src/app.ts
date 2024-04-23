import express, { Request, Response, NextFunction } from 'express';
import { router } from './routes';

export const app = express();
export const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(router);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    console.error(err.stack); // Also log error stack for debugging

    // TODO: Remove sensitive info from any error messages.
  
    res.status(500).send({ error: err.message });
  });
  