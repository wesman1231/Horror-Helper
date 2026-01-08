import type { Request, Response } from "express";
import { db } from "../db/pool.ts";
import { directorDB } from "../db/pool.ts";
import dotenv from 'dotenv';
dotenv.config();

/**
 * directorDataController
 * --------------------------------------------------
 * Express controller responsible for fetching all
 * director-related data for a given director name.
 *
 * Data sources:
 *  - Local movies database (movies directed by person)
 *  - Local directors database (TMDB ID + profile image path)
 *  - TMDB API (full director profile data)
 *
 * Route:
 *  GET /api/director/:directorName
 *
 * Example:
 *  /api/director/John+Carpenter
 *
 * Response:
 *  {
 *    movies: Movie[],
 *    image: string,
 *    profile: TMDBPersonObject
 *  }
 */
export default async function directorDataController(req: Request, res: Response){
    
    /**
   * Convert URL-safe director name back to a normal string.
   * Express params convert spaces to `+`, so we reverse that
   * to match database values.
   */
    const fromatDirectorName = String(req.params.directorName).replaceAll('+', ' ');

    /**
   * Fetch all required director data.
   * These calls are currently sequential.
   */
    const movies = await getDirectorMovies();
    const image = await getDirectorImage();
    const profile = await getDirectorProfile();

    /**
   * If no TMDB profile is returned, assume the director
   * does not exist and return a 404 response.
   */
    if(profile === undefined){
        return res.status(404).json({error: 'no director found'});
    }
    
    /**
   * Successful response containing:
   *  - movies: all locally stored films by director
   *  - image: TMDB profile image URL (w300 size)
   *  - profile: full TMDB person profile JSON
   */
    return res.status(200).json({movies: movies, image: image, profile: profile});
    
    /**
     * --------------------------------------------------
     * getDirectorMovies
     * --------------------------------------------------
     * Queries the local movies database for all movies
     * directed by the specified director.
     *
     * Results are ordered by release date.
     */
    async function getDirectorMovies(){
        
        try{
            const [getMovies] = await db.execute(`SELECT * FROM movies WHERE director = ? ORDER BY releasedate`, [fromatDirectorName]);
            return getMovies;
        }
        catch(error){  
            console.error(error);
        }
    }
    
    /**
     * --------------------------------------------------
     * getDirectorImage
     * --------------------------------------------------
     * Retrieves the TMDB profile image path from the
     * local directors database and constructs a full
     * TMDB image URL using the w300 size preset.
     */
    async function getDirectorImage(){
        try{
            const [directorImagePath]: any[] = await directorDB.execute(`SELECT tmdbprofile AS imgpath FROM directors WHERE name = ?`, [fromatDirectorName]);
            const image = `https://image.tmdb.org/t/p/w300${directorImagePath[0].imgpath}`;
            return image
        }
        catch(error){
            console.error(error);
        }
    }

    /**
     * --------------------------------------------------
     * getDirectorProfile
     * --------------------------------------------------
     * Fetches the director's TMDB ID from the local
     * directors database, then retrieves the full
     * person profile from the TMDB API.
     *
     * Requires TMDB_API_KEY to be set in environment variables.
     */
    async function getDirectorProfile(){
        const [directorID]: any[] = await directorDB.execute(`SELECT tmdbid FROM directors WHERE name = ?`, [fromatDirectorName]);
        const directorProfileRequest = await fetch(`https://api.themoviedb.org/3/person/${directorID[0].tmdbid}?api_key=${process.env.TMDB_API_KEY}`);
        const directorProfile = await directorProfileRequest.json();
        return directorProfile;
    }

}
