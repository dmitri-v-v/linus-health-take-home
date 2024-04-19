import express from 'express';
import { router } from './routes';

export const app = express();
export const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(router);
