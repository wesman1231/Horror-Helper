import express from 'express';
import directorDataController from '../controller/directorDataController.js';

const router = express.Router();

router.get(`/:directorName`, directorDataController);

export default router;