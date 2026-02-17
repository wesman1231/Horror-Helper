import express from "express";
import { checkJWT } from "../middleware/checkJWT.ts";
import { postReview } from "../controller/reviewController.ts";

const router = express.Router();

router.post('/post', checkJWT, postReview);

export default router;