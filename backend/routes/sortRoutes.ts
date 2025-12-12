import express from 'express';
import sortController from '../controller/sortController.ts'

const router = express.Router();

router.post('/movies', sortController.sort);



export default router;