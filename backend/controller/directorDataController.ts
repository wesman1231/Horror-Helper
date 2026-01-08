import type { Request, Response } from "express";
import { db } from "../db/pool.ts";
import { directorDB } from "../db/pool.ts";
import dotenv from 'dotenv';
dotenv.config();

export default async function directorDataController(req: Request, res: Response){
    
    const fromatDirectorName = String(req.params.directorName).replaceAll('+', ' ');

    const movies = await getDirectorMovies();
    const image = await getDirectorImage();
    const profile = await getDirectorProfile();

    if(profile === undefined){
        return res.status(404).json({error: 'no director found'});
    }
    
    return res.status(200).json({movies: movies, image: image, profile: profile});
    
    
    async function getDirectorMovies(){
        
        try{
            const [getMovies] = await db.execute(`SELECT * FROM movies WHERE director = ? ORDER BY releasedate`, [fromatDirectorName]);
            return getMovies;
        }
        catch(error){  
            console.error(error);
        }
    }
    
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

    async function getDirectorProfile(){
        const [directorID]: any[] = await directorDB.execute(`SELECT tmdbid FROM directors WHERE name = ?`, [fromatDirectorName]);
        const directorProfileRequest = await fetch(`https://api.themoviedb.org/3/person/${directorID[0].tmdbid}?api_key=${process.env.TMDB_API_KEY}`);
        const directorProfile = await directorProfileRequest.json();
        return directorProfile;
    }

}
