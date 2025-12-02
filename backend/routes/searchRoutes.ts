import express from 'express';
import searchController from '../controller/searchController.ts'

const router = express.Router();

router.get('/allMovies', searchController.getAllMovies)
router.get('/movies', searchController.searchMovies);
router.get('/cast_synopsis', searchController.getDirectorAndSynopsis);

export default router;