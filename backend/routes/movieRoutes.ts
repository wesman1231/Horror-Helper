import express from 'express';
import { fetchMovieInfo } from '../controller/movieDataController.ts';
import { fetchNewReleases } from '../controller/movieDataController.ts';
import { fetchFranchiseInfo } from '../controller/movieDataController.ts';

const router = express.Router();

router.get('/new-releases', fetchNewReleases);
router.get('/:id', fetchMovieInfo);
router.get('/franchises/:franchiseName', fetchFranchiseInfo);


export default router;

