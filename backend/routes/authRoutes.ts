import express from "express";
import { checkJWT } from "../middleware/checkJWT.ts";
import { body, check } from 'express-validator';

const router = express.Router();



export default router;