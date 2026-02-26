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
    const elementsPerPage: string = '10';
    const pageNumber: number = Number(req.query.page);
    const calculateOffset = pageNumber * Number(elementsPerPage);
    const offset = String(calculateOffset);
    
    await queryDB();

    //TODO: FIND A WAY TO GET THE TOTAL NUMBER OF NEW RELEASES TO COUNT THE NUMBER OF PAGES WITHOUHT DOING 2 QUERIES IF POSSIBLE
    async function queryDB(){
        try{
            const [newMovies]: any[] = await db.execute('SELECT * FROM movies WHERE releasedate LIKE ? ORDER BY releasedate DESC LIMIT ? OFFSET ?', [`%${stringCurrentYear}%`, elementsPerPage, offset]);
            const numberOfPages = Math.ceil(newMovies.length / Number(elementsPerPage));
            return res.status(200).json({newReleases: newMovies, numberOfPages: numberOfPages});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: "Internal server error"});
        }
    }
}