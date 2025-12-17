import type { Request, Response } from "express";
import { db } from "../db/pool.ts";

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
}

export default new directorDataController();