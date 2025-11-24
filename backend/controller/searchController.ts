import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.ts';

class searchController{
    
    //used to get movies from TMBD into local DB
    public async getAllMovies(req: Request, res: Response){
        const moviesArray = [];
        const callTMBD1 = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&primary_release_year=2025&with_genres=27`);
        const firstCallResult = await callTMBD1.json();
        for(let i = 1; i < firstCallResult.total_pages; i++){
            try{
            const callTMBD = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&primary_release_year=2025&with_genres=27&page=${i}`);
            const results = await callTMBD.json();
            moviesArray.push(...results.results);
        }catch(error){
            console.error('error searching: ', error);
        }
        }
        for(let i = 0; i < moviesArray.length; i++){
            db.execute(`INSERT INTO movies(tmdbid, title, poster, releasedate) VALUES(?, ?, ?, ?)`, [moviesArray[i].id, moviesArray[i].title, moviesArray[i].poster_path, moviesArray[i].release_date]);
        }
        res.status(200).send(moviesArray);
    }


    public async searchMovies(req: Request, res: Response){
        const searchQuery = String(req.query.query || '').trim();

        try{
            const callTMBD = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=27&query=${searchQuery}`);
            if(callTMBD.ok){
                const result = await callTMBD.json();
                res.status(200).send(result);
                console.log(result);
            }
        }catch(error){
            console.error('error searching: ', error);
        }
    }
}

export default new searchController();