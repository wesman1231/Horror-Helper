import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

/**
 * Fetches movie details by TMDB ID from the database.
 */
export async function fetchMovieInfo(req: Request, res: Response): Promise<void>{
    try {
        const movieId = Number(req.params.id);

        // Executing the query
        const [rows]: any = await db.execute('SELECT * FROM movies WHERE tmdbid = ?', [movieId]);

        // Check if the result set is empty
        if (!rows || rows.length === 0) {
            res.status(404).json({ error: '404 Movie/Show could not be found' });
            return; 
        }

        // Send the movie data (usually the first element if tmdbid is unique)
        res.status(200).json(rows[0]);
        
    } catch (error) {
        console.error('Error fetching movie info:', error);
        res.status(500).json({ error: 'Internal server error', req });
    }
};

export async function fetchFranchiseInfo(req: Request, res: Response){
    const franchiseName = String(req.params.franchiseName).replaceAll('+', ' ');
        
    try{
        //query database to get all movies in a franchise
        const [fetchMoviesFromDB]: any[] = await db.execute(`SELECT * FROM movies WHERE franchise = ? ORDER BY releasedate `, [franchiseName]);

        //if franchise cannot be found, return 404 error
        if(fetchMoviesFromDB === null || fetchMoviesFromDB.length === 0){
            return res.status(404).json({error: "Franchise does not exist"});
        }
        
        //if no errors, return movies
        return res.status(200).json({movies: fetchMoviesFromDB});
    }
    catch(error){
        return res.status(500).json({error: error});
    }
    
}

export async function fetchNewReleases(req: Request, res: Response){
    const currentDate: Date = new Date();
    const stringCurrentYear = String(currentDate.getFullYear());
    console.log(stringCurrentYear);
    
    try{
        const [newMovies] = await db.execute('SELECT * FROM movies WHERE releasedate LIKE ? ORDER BY releasedate DESC LIMIT 10', [`%${stringCurrentYear}%`]);
        return res.status(200).json({newMovies: newMovies});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
}