import express from 'express';
import { searchController } from '../controller/searchController.ts'

const router = express.Router();

router.get('/movies', searchController.searchMovies);
router.get('/shows', searchController.searchTV);

export default router;