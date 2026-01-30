import express from 'express';
import searchController from '../controller/searchController.ts';
import { checkJWT } from '../middleware/checkJWT.ts';

const router = express.Router();

router.get('/movies', checkJWT, searchController);
router.get('/shows', searchController);

export default router;