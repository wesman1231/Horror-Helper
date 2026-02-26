import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

export async function fetchShowInfo(req: Request, res: Response){
    //take the show id from the url, find that show in the database, and send it back to the client
    try{
        const showId = req.params.id;
        const [showInfo]: any[] = await db.execute('SELECT * FROM shows WHERE tmdbid = ?', [showId]);
        if(showInfo.length === 0){
            res.status(404).json({error: '404 Movie/Show could not be found'});
        }
        else{
            res.status(200).json(showInfo);
        }
    }catch(error){
        console.error('Error', error);
    }
}

export async function fetchNewReleases(req: Request, res: Response){
    const currentDate: Date = new Date();
    const stringCurrentYear = String(currentDate.getFullYear());
    const elementsPerPage: string = '10';
    const pageNumber: number = Number(req.query.page);
    const calculateOffset = pageNumber * Number(elementsPerPage);
    const offset = String(calculateOffset);
    
    await query();

    async function query(){
        try{
            const [newShows] = await db.execute('SELECT * FROM shows WHERE firstairdate LIKE ? ORDER BY firstairdate DESC LIMIT ? OFFSET ?', [`%${stringCurrentYear}%`, elementsPerPage, offset]);
            return res.status(200).json({newShows: newShows});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({error: "Internal server error"});
        }
    }
}

