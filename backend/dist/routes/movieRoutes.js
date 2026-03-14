import express from 'express';
import { fetchMovieInfo } from '../controller/movieDataController.js';
import { fetchNewReleases } from '../controller/movieDataController.js';
import { fetchFranchiseInfo } from '../controller/movieDataController.js';
const router = express.Router();
router.get('/new-releases', fetchNewReleases);
router.get('/:id', fetchMovieInfo);
router.get('/franchises/:franchiseName', fetchFranchiseInfo);
export default router;
