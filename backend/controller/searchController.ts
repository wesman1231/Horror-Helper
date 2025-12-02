import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.ts';

class searchController{
    
    //used to get movies from TMBD into local DB
    public async getAllMovies(req: Request, res: Response){
        //loop from year 1920-2025
        for(let i = 1920; i < 2025; i++){
            const callTMBD1 = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&primary_release_year=${i}&with_genres=27`);
            const firstCallResult = await callTMBD1.json();
            
            //loop through total pages for the year
            for(let j = 1; j < firstCallResult.total_pages; j++){
            try{
                const callTMBD = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&primary_release_year=${i}&with_genres=27&page=${j}`);
                const results = await callTMBD.json();
                
                //loop through results of each fetch for the year
                for(let k = 0; k < results.results.length; k++){
                    const keywords = await fetch(`https://api.themoviedb.org/3/movie/${results.results[k].id}/keywords?api_key=${process.env.TMDB_API_KEY}`);
                    const keywordsResult = await keywords.json();
                    //get keywords for the current movieid
                    if(Object.hasOwn(keywordsResult, 'keywords')){
                        const keywordArray: string[] = [];
                        for(let l = 0; l < keywordsResult.keywords.length; l++){
                            keywordArray.push(keywordsResult.keywords[l].name);
                        }
                        const stringKeywords = keywordArray.join(', ');
                        await db.execute(`INSERT INTO movies(tmdbid, title, poster, keywords, releasedate) VALUES(?, ?, ?, ?, ?)`, [results.results[k].id, results.results[k].title, results.results[k].poster_path, stringKeywords, results.results[k].release_date]);
                    }
                    else{
                        await db.execute(`INSERT INTO movies(tmdbid, title, poster, releasedate) VALUES(?, ?, ?, ?)`, [results.results[k].id, results.results[k].title, results.results[k].poster_path, results.results[k].release_date]);
                    }
                }
            }catch(error){
            console.error('error searching: ', error);
            }
        }
    }    
    res.status(200).send({message: 'finished adding movies'});
}

    public async getDirectorAndSynopsis(req: Request, res:Response){
        const [ids]: any[] = await db.execute('SELECT tmdbid from movies');
        const castArray: any[] = [];
        let director = "";
        for(let i = 0; i < ids.length; i++){
            try{
                const credits = await fetch(`https://api.themoviedb.org/3/movie/${ids[i].tmdbid}?append_to_response=credits&api_key=${process.env.TMDB_API_KEY}`);
                const creditsResult = await credits.json();
                if(Object.hasOwn(creditsResult, 'credits')){
                    //grab cast members and their characters and add them to the castArray
                    for(let j = 0; j < creditsResult.credits.cast.length; j++){
                        const actor = creditsResult.credits.cast[j];
                        const character = actor.character?.trim() || "Unknown";
                        castArray.push(`${actor.name} (${character})`);
                    }
                //join castArray as a string separated by a comma and a space 
                const stringCast = castArray.join(', ');
                
                //loop through the crew and find the director
                for(let j = 0; j < creditsResult.credits.crew.length; j++){
                    if(creditsResult.credits.crew[j].job === 'Director'){
                        director = creditsResult.credits.crew[j].name;
                    }
                }

                //check if the film belongs to a franchise
                if(creditsResult.belongs_to_collection != null){
                    await db.execute('UPDATE movies SET cast = ?, synopsis = ?, franchise = ?, director = ? WHERE tmdbid = ?', [stringCast, creditsResult.overview, creditsResult.belongs_to_collection.name, director, ids[i].tmdbid]);
                    castArray.length = 0;
                }
                else if(creditsResult.belongs_to_collection === null){
                    await db.execute('UPDATE movies SET cast = ?, synopsis = ?, director = ? WHERE tmdbid = ?', [stringCast, creditsResult.overview, director, ids[i].tmdbid]);
                    castArray.length = 0;
                }
            }
            }catch(error){
                console.error('error getting data', error);
            }
        }
        res.status(200);
    }

    //search for movies
    public async searchMovies(req: Request, res: Response){
        const searchQuery = String(req.query.query || '').trim();
        const formatSearchQuery = searchQuery.replaceAll('+', ' ');
        try{
            
            const [findResult] = await db.execute('SELECT * FROM MOVIES WHERE title LIKE ? OR keywords LIKE ? OR franchise LIKE ?', [`%${formatSearchQuery}%`, `%${formatSearchQuery}%`, `%${formatSearchQuery}%`]);
            if((findResult as any[]).length === 0){
                res.status(404).json({message: 'no results found'});
            }
            res.status(200).json({message: 'results found', findResult: findResult});
        }catch(error){
            console.error('error searching: ', error);
        }
    }
}

export default new searchController();