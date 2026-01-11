import express from "express";
import signup from "../controller/authController.ts";
import { body } from 'express-validator';

const validateEmail = () => body('email')
                            .notEmpty()
                            .trim()
                            .isEmail();
const validatePassword = () => body('password')
                                .notEmpty();
const router = express.Router();

router.post('/signup', validateEmail(), validatePassword(), signup);

export default router;