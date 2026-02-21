import express from "express";
import { checkJWT } from "../middleware/checkJWT.ts";
import { postReview, getReviews } from "../controller/reviewController.ts";

const router = express.Router();

router.get('/get', getReviews);
router.post('/post', checkJWT, postReview);

export default router;