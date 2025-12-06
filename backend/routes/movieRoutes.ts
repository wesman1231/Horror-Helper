import express from 'express';
import movieDataController from '../controller/movieDataController.ts';

const router = express.Router();

router.get('/:id', movieDataController.fetchMovieInfo);

export default router;

