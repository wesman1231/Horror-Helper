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

    //used to get shows from TMBD into local DB
    public async getAllShows(req: Request, res: Response){
        const keywordArray: string[] = [];
        //loop through all tv show pages
        for(let i = 1; i <= 10511 ; i++){
            const callTMBD = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&page=${i}`);
            const callTMBDResult = await callTMBD.json();

            //check if result has the results property (the array of shows)
            if(Object.hasOwn(callTMBDResult, 'results')){
                for(let j = 0; j < callTMBDResult.results.length; j++){
                const keywords = await fetch(`https://api.themoviedb.org/3/tv/${callTMBDResult.results[j].id}/keywords?api_key=${process.env.TMDB_API_KEY}`);
                const keywordsResult = await keywords.json();
                

                //check if keywords exist and if show has the horror keyword
                if(Object.hasOwn(keywordsResult, 'results')){
                    const findHorrorTag = keywordsResult.results.find((keyword: { name: string; }) => keyword.name === 'horror');
                    
                    if(findHorrorTag){
                        for(const keywords of keywordsResult.results){
                            keywordArray.push(keywords.name);
                        }
                        const stringKeywords = keywordArray.join(', ');
                        await db.execute(`INSERT IGNORE INTO shows(tmdbid, title, poster, keywords, firstairdate, synopsis) VALUES(?, ?, ?, ?, ?, ?)`, [callTMBDResult.results[j].id, callTMBDResult.results[j].name, callTMBDResult.results[j].poster_path, stringKeywords, callTMBDResult.results[j].first_air_date, callTMBDResult.results[j].overview]);
                        keywordArray.length = 0;
                    }
                }
            }
            }
            
        }
        res.status(200).send('finished import');
    }

    //get number of episodes and seasons, final episode date, and creator
    public async getAdditionalShowInfo(req: Request, res: Response){
        const creators = [];
        const [getShowIds]: any[] = await db.execute(`SELECT tmdbid FROM shows`);
        for(let i = 0; i < getShowIds.length; i++){
            const getCredits = await fetch(`https://api.themoviedb.org/3/tv/${getShowIds[i].tmdbid}?append_to_response=credits&api_key=${process.env.TMDB_API_KEY}`);
            const creditsResult = await getCredits.json();
                
            if(Object.hasOwn(creditsResult, 'created_by')){
                for(let j = 0; j < creditsResult.created_by.length; j++){
                    creators.push(creditsResult.created_by[j].name);
                }
                const stringCreators = creators.join(', ');
                await db.execute(`UPDATE shows SET lastairdate = ?, seasons = ?, episodes = ?, creator = ? WHERE tmdbid = ?`, [creditsResult.last_air_date, creditsResult.number_of_seasons, creditsResult.number_of_episodes, stringCreators, getShowIds[i].tmdbid]);
                creators.length = 0;
            }
            else if(!Object.hasOwn(creditsResult, 'created_by')){
                await db.execute(`UPDATE shows SET lastairdate = ?, seasons = ?, episodes = ?, creator = ? WHERE tmdbid = ?`, [creditsResult.last_air_date, creditsResult.number_of_seasons, creditsResult.number_of_episodes, 'N/A', getShowIds[i].tmdbid]);
            }
        }
        res.status(200).send('finished importing');
    }

    //search for movies
    public async searchMovies(req: Request, res: Response){
        const searchQuery = String(req.query.query || '').trim();
        const formatSearchQuery = searchQuery.replaceAll('+', ' ');
        try{
            const [findResult]: any[] = await db.execute('SELECT * FROM movies WHERE title LIKE ? OR keywords LIKE ?', [`%${formatSearchQuery}%`, `%${formatSearchQuery}%`]);
            const paginatedResults: any[][] = []; //full results with subarrays as pages of content
            
            if(findResult.length === 0){
                res.status(404).json({message: 'no results found'});
            }
            
            else{
                //jump through results in segments of 10 and create a page array each loop
                for(let i = 0; i < findResult.length; i += 10){
                    const page: object[] = []; 

                    //if there are 10 or more elements to go, loop through them and push them to the page array
                    if(i + 10 <= findResult.length){
                        for(let j = i; j < i + 10; j++){
                            page.push(findResult[j]);                   
                        }
                        paginatedResults.push(page); //push the pages to the paginatedResults on each loop of 10
                    }

                    //if there are less than 10 elements remaining in the results, loop through the remaining elements and push them to the page array
                    else if(i + 10 > findResult.length){
                        for(let j = i; j < findResult.length; j++){
                            page.push(findResult[j]);    
                        }
                        paginatedResults.push(page); //push the page to the paginatedResults
                    }
                }
                res.status(200).json({message: 'results found', paginatedResults: paginatedResults});
            }
        
        }catch(error){
            console.error('error searching: ', error);
        }
    }

    

    //search for shows
    public async searchTV(req: Request, res: Response){
        const searchQuery = String(req.query.query || '').trim();
        const formatSearchQuery = searchQuery.replaceAll('+', ' ');
        try{
            const [findResult]: any[] = await db.execute('SELECT * FROM shows WHERE title LIKE ? OR keywords LIKE ?', [`%${formatSearchQuery}%`, `%${formatSearchQuery}%`]);
            const paginatedResults: any[][] = [];
            
            if(findResult.length === 0){
                res.status(404).json({message: 'no results found'});
            }
            
            else{
                for(let i = 0; i < findResult.length; i += 10){
                    const page: object[] = []; 
                    if(i + 10 < findResult.length){
                        for(let j = i; j < j + 10; j++){
                            page.push(findResult[j]);                   
                        }
                    }
                    else if(i + 10 > findResult.length){
                        for(let j = i; j < findResult.length; j++){
                            page.push(findResult[j]);    
                        }
                    }    
                
                    paginatedResults.push(page);
                }
                res.status(200).json({message: 'results found', paginatedResults: paginatedResults});
            }
        
        }catch(error){
            console.error('error searching: ', error);
        }
    }
}

export default new searchController();