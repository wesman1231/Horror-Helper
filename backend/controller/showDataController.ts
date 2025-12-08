import type { Request, Response } from 'express';
import { db } from '../db/pool.ts';

class showDataController{
    public async fetchShowInfo(req: Request, res: Response){
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
}

export default new showDataController();