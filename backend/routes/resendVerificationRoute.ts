import express from 'express';
import { resendVerification } from '../controller/authController.ts';
const router = express.Router();

router.post('/resend-verification', resendVerification);

export default router;