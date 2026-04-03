import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import showRoutes from './routes/showRoutes.js';
import directorRoutes from './routes/directorRoutes.js';
import resendVerificationRoutes from './routes/resendVerificationRoute.js';
import reviewRoutes from './routes/reviewRoutes.js';
import syncDirectors from './routes/getAllDirectors.js'


const app = express();
dotenv.config();

const corsOptions = {
  origin: ['https://image.tmdb.org', 'https://horrorhelper.com', 'http://localhost:3000', 'https://api.themoviedb.org']
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

//routes
app.get('/', (req, res) => {
  res.status(200).send('Horror Helper API is alive!');
});
app.get('/test', (req, res) => {
  res.status(200).send('deployment workflow is working');
});
app.use('/api/search', searchRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api', resendVerificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use(syncDirectors); 


app.listen(8080, '0.0.0.0', () => {
    console.log("IT'S ALIVE AT http://localhost:8080");
});