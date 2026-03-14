import express from 'express';
import searchController from '../controller/searchController.js';
const router = express.Router();
router.get('/movies', searchController);
router.get('/shows', searchController);
export default router;
