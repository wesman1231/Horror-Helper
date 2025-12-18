import type { Request, Response } from "express";
import { db } from "../db/pool.ts";
import { directorDB } from "../db/pool.ts";
import dotenv from 'dotenv';
dotenv.config();

class directorDataController{
    public async getDirectorInfo(req: Request, res: Response){
        try{
            const fromatDirectorName = String(req.params.directorName).replaceAll('+', ' ');
            const [getDirectorMovies] = await db.execute(`SELECT * FROM movies WHERE director = ?`, [fromatDirectorName]);
            res.status(200).json(getDirectorMovies);
        }catch(error){  
            console.error(error);
        }
    }

    public async getDirectorFromTMDB(req: Request, res: Response){
        const [directors]: any[] = await db.execute(`SELECT DISTINCT director FROM movies WHERE director IS NOT NULL;`);
        for(let i = 0; i < directors.length; i++){
            const formatQuery = directors[i].director.replaceAll(' ', '+');
            const getDirectorInfo = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API_KEY}&query=${formatQuery}`);
            const directorInfo = await getDirectorInfo.json();

            if(directorInfo.results[0] === undefined){
                continue;
            }
            if(directorInfo.results[0].id === null || directorInfo.results[0].name === null || directorInfo.results[0].profile_path === null || directorInfo.results[0].id === undefined || directorInfo.results[0].name === undefined || directorInfo.results[0].profile_path === undefined ){
                continue
            }
            else{
                if(Object.hasOwn(directorInfo.results[0], 'id') && Object.hasOwn(directorInfo.results[0], 'name') && Object.hasOwn(directorInfo.results[0], 'profile_path')){
                    await directorDB.execute(`INSERT IGNORE INTO directors(tmdbid, name, imgpath) VALUES(?, ?, ?)`, [directorInfo.results[0].id, directorInfo.results[0].name, directorInfo.results[0].profile_path]);
                }
            }

            
                
        }
        res.status(200).send('done');
    }
}

export default new directorDataController();