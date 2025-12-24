import express from 'express';
import { searchController } from '../controller/searchController.ts'

const router = express.Router();

router.get('/movies', searchController.search);
router.get('/shows', searchController.search);

export default router;