import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.ts';
import movieRoutes from './routes/movieRoutes.ts';
import showRoutes from './routes/showRoutes.ts';
import sortRoutes from './routes/sortRoutes.ts';


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//routes
app.use('/api/search', searchRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/sort', sortRoutes);

app.listen(3000, () => {
    console.log("IT'S ALIVE AT http://localhost:3000");
});