import express from "express";
import { validateSignup } from "../controller/authController.ts";
import { validateLogin } from "../controller/authController.ts";
import { body } from 'express-validator';

const validateEmail = () => body('email')
                            .notEmpty()
                            .trim()
                            .isEmail();
const validatePassword = () => body('password')
                                .notEmpty();
const router = express.Router();

router.post('/signup', validateEmail(), validatePassword(), validateSignup);
router.post('/login', validateEmail(), validatePassword(), validateLogin);

export default router;