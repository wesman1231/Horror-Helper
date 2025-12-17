import express from 'express';
import directorDataController from '../controller/directorDataController.ts';

const router = express.Router();

router.get(`/:directorName`, directorDataController.getDirectorInfo);

export default router;