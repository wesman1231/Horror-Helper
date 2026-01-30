import express from "express";
import { validateSignup, validateLogin } from "../controller/authController.ts";
import { body } from 'express-validator';

const validateEmail = () => body('email')
                            .notEmpty().withMessage("Email is required")
                            .trim()
                            .isEmail()
                            .withMessage("Invalid Email");
const validatePassword = () => body('password')
                                .notEmpty().withMessage("Password is required")
                                .withMessage("Invalid Password");
const router = express.Router();

router.post('/signup', validateEmail(), validatePassword(), validateSignup);
router.post('/login', validateEmail(), validatePassword(), validateLogin);

export default router;