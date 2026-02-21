import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

export async function postReview(req: Request, res: Response){
    const { userID, userName, reviewScore, reviewText, mediaType } = req.body.reviewInfo;
    const mediaID = req.query.mediaID;


    verifyMediaType();
    ingestReview();


    function verifyMediaType(){
        if(mediaType !== 'movies' && mediaType !== 'shows'){
            return res.status(400).json({message: 'Invalid media type'});
        }
    }

    async function ingestReview(){
        try{
            if(mediaType === 'movies'){
                await db.execute(`INSERT INTO reviews (userID, username, reviewScore, reviewText, movieID, showID) VALUES (?, ?, ?, ?, ?, ?)`, [userID, userName, reviewScore, reviewText, mediaID, null]);
            }

            if(mediaType === 'shows'){
                await db.execute(`INSERT INTO reviews VALUES (?, ?, ?, ?, ?, ?)`, [userID, userName, reviewScore, reviewText, null, mediaID]);
            }

            return res.status(200).json({message: 'Review posted!'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({message: 'Internal server error', body: req.body.reviewInfo});
        }
    }
}




export async function getReviews(req: Request, res: Response){
    const mediaId = req.query.mediaID;
    const mediaType = req.query.mediaType;


    verifyMediaType();
    await fetchReviews();


    function verifyMediaType(){
        if(mediaType !== 'movies' && mediaType !== 'shows'){
            return res.status(400).json({message: 'Invalid media type'});
        }
    }

    async function fetchReviews(){
        try{
            if(mediaType === 'movies'){
                const [reviews] = await db.execute(`Select * FROM reviews WHERE movieID = ?`, [mediaId]);
                return res.status(200).json({reviews: reviews});
            }

            if(mediaType === 'shows'){
                const [reviews] = await db.execute(`Select * FROM reviews WHERE showID = ?`, [mediaId]);
                return res.status(200).json({reviews: reviews});
            }
        }
        catch(error){
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}