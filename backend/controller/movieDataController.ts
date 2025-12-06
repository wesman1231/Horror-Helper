import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

class movieDataController{
    public async fetchMovieInfo(req: Request, res: Response){
        //take the movie id from the url, find that movie in the database, and send it back to the client
        try{
            const movieId = req.params.id;
            const [movieInfo]: object[] = await db.execute('SELECT * FROM movies WHERE tmdbid = ?', [movieId]);
            res.status(200).json(movieInfo);

        }catch(error){
            console.error('Error', error);
        }
    }
}

export default new movieDataController();