import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

/**
 * Handles the creation of a new review.
 * Expects review data in req.body and the specific media ID in req.query.
 */
export async function postReview(req: Request, res: Response) {
    // Destructure properties from the nested reviewInfo object in the request body
    const { userID, username, reviewScore, reviewText, mediaType, reviewID } = req.body.reviewData;
    
    // Extract the mediaID from the URL query parameters (e.g., ?mediaID=123)
    const mediaID = req.query.mediaID;

    // Validate input and then attempt to save to DB
    if(verifyMediaType() === false){
        return res.status(400).json({ message: 'Invalid media type' });
    }
    await ingestReview();

    /**
     * Ensures the request is querying a valid category.
     */
    function verifyMediaType() {
        if (mediaType !== 'movies' && mediaType !== 'shows') {
            return false
        }
        else{
            return true;
        }
    }

    /**
     * Attempts to insert the review data into the database.
     */
    async function ingestReview() {
        try {
            // Logic for Movie reviews: sets movieID to the mediaID and showID to null
            if (mediaType === 'movies') {
                await db.execute(
                    `INSERT INTO reviews (userID, username, reviewScore, reviewText, movieID, showID, reviewID) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [userID, username, reviewScore, reviewText, mediaID, null, reviewID]
                );
            }

            // Logic for Show reviews: sets showID to the mediaID and movieID to null
            if (mediaType === 'shows') {
                await db.execute(
                    `INSERT INTO reviews (userID, username, reviewScore, reviewText, movieID, showID) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [userID, username, reviewScore, reviewText, null, mediaID, reviewID]
                );
            }

            // Return success response to the client
            return res.status(200).json({ message: 'Review posted!' });
        } catch (error) {
            // Log the error for server-side debugging and return a 500 status
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal server error', 
                body: req.body.reviewInfo 
            });
        }
    }
}

/**
 * Retrieves reviews for a specific piece of media.
 * Expects mediaID and mediaType in the URL query parameters.
 */
export async function getReviews(req: Request, res: Response) {
    const mediaId = req.query.mediaID;
    const mediaType = req.query.mediaType;
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const offset = Number(page) * Number(limit);

    // Validate input and then attempt to fetch from DB
    if(verifyMediaType() === false){
        return res.status(400).json({ message: 'Invalid media type' });
    }
    await fetchReviews();

    /**
     * Ensures the request is querying a valid category.
     */
    function verifyMediaType() {
        if (mediaType !== 'movies' && mediaType !== 'shows') {
            return false
        }
        else{
            return true;
        }
    }

    /**
     * Queries the database based on the media type and ID.
     */
    async function fetchReviews() {
        try {
            // Querying by movie identity
            if (mediaType === 'movies') {
                
                const [totalResults]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM reviews WHERE movieID = ?`, [mediaId]);
                const numberOfPages = Math.ceil(totalResults[0].total / Number(limit));

                const [reviews] = await db.execute(`SELECT * FROM reviews WHERE movieID = ? LIMIT ? OFFSET ?`, [mediaId, `${limit}`, `${offset}`]);
                return res.status(200).json({ reviews: reviews, numberOfPages: numberOfPages });
            }

            // Querying by show identity
            if (mediaType === 'shows') {
                const [reviews] = await db.execute(`SELECT * FROM reviews WHERE showID = ?`, [mediaId]);
                return res.status(200).json({ reviews: reviews });
            }
        } catch (error) {
            // General error handling for DB connection issues or query syntax errors
            console.error(error)
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}