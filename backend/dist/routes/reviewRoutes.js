import express from "express";
import { checkJWT } from "../middleware/checkJWT.js";
import { postReview, getReviews } from "../controller/reviewController.js";
const router = express.Router();
router.get('/get', getReviews);
router.post('/post', checkJWT, postReview);
export default router;
