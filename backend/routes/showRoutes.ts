import express from 'express';
import { fetchShowInfo, fetchNewReleases } from '../controller/showDataController.ts';

const router = express.Router();

router.get('/new-releases', fetchNewReleases)
router.get('/:id', fetchShowInfo);

export default router;