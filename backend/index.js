import express from 'express';
import rootrouter from './routes/index.js';
import { connectDB } from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app=express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/v1',rootrouter);

app.listen(PORT, () => {
  console.log(` Server running at port:${PORT}`);
});
