import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.ts';


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/search', searchRoutes);

app.listen(3000, () => {
    console.log("IT'S ALIVE AT http://localhost:3000");
});