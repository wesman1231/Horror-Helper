import express from 'express';
import showDataController from '../controller/showDataController.ts';

const router = express.Router();

router.get('/:id', showDataController.fetchShowInfo);

export default router;