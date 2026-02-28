import express from 'express';
import directorDataController from '../controller/directorDataController.ts';

const router = express.Router();

router.get('/getDirectorInfo', directorDataController);
router.get(`/:directorName`, directorDataController);


export default router;