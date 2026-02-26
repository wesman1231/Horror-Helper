import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

/**
 * Handles the creation of a new review.
 * Expects review data in req.body and the specific media ID in req.query.
 */
export async function postReview(req: Request, res: Response) {
    // Destructure properties from the nested reviewInfo object in the request body
    const { userID, userName, reviewScore, reviewText, mediaType } = req.body.reviewInfo;
    
    // Extract the mediaID from the URL query parameters (e.g., ?mediaID=123)
    const mediaID = req.query.mediaID;

    // Execute validation and ingestion logic
    verifyMediaType();
    await ingestReview();

    /**
     * Validates that the mediaType is either 'movies' or 'shows'.
     * If invalid, it sends a 400 Bad Request response immediately.
     */
    function verifyMediaType() {
        if (mediaType !== 'movies' && mediaType !== 'shows') {
            return res.status(400).json({ message: 'Invalid media type' });
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
                    `INSERT INTO reviews (userID, username, reviewScore, reviewText, movieID, showID) VALUES (?, ?, ?, ?, ?, ?)`, 
                    [userID, userName, reviewScore, reviewText, mediaID, null]
                );
            }

            // Logic for Show reviews: sets showID to the mediaID and movieID to null
            if (mediaType === 'shows') {
                await db.execute(
                    `INSERT INTO reviews (userID, username, reviewScore, reviewText, movieID, showID) VALUES (?, ?, ?, ?, ?, ?)`, 
                    [userID, userName, reviewScore, reviewText, null, mediaID]
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

    // Validate input and then attempt to fetch from DB
    verifyMediaType();
    await fetchReviews();

    /**
     * Ensures the request is querying a valid category.
     */
    function verifyMediaType() {
        if (mediaType !== 'movies' && mediaType !== 'shows') {
            return res.status(400).json({ message: 'Invalid media type' });
        }
    }

    /**
     * Queries the database based on the media type and ID.
     */
    async function fetchReviews() {
        try {
            // Querying by movie identity
            if (mediaType === 'movies') {
                // Destructure the first element (the rows) from the db.execute result
                const [reviews] = await db.execute(`SELECT * FROM reviews WHERE movieID = ?`, [mediaId]);
                return res.status(200).json({ reviews: reviews });
            }

            // Querying by show identity
            if (mediaType === 'shows') {
                const [reviews] = await db.execute(`SELECT * FROM reviews WHERE showID = ?`, [mediaId]);
                return res.status(200).json({ reviews: reviews });
            }
        } catch (error) {
            // General error handling for DB connection issues or query syntax errors
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}