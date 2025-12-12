import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.ts';

class sortController{

    //TO DO: OPTIMIZE FUNCTIONALITY FOR LARGER DATASETS
    public async sort(req: Request, res: Response){  
        try{
            const paginatedResults: any[] = [];
            const sortMode = req.query.sortMode;
            const unPaginate = req.body.arrayToSort.flat(Infinity);
            
            switch(sortMode){
                case 'default':
                    unPaginate.sort((a: { releasedate: string; }, b: { releasedate: string; }) => (a.releasedate.localeCompare(b.releasedate)));
                break;

                case 'newest':
                    unPaginate.sort((a: { releasedate: string; }, b: { releasedate: string; }) => (b.releasedate.localeCompare(a.releasedate)));
                break;

                case 'title':
                    unPaginate.sort((a: { title: string; }, b: { title: string; }) => (a.title.localeCompare(b.title)));
                break;

                case 'director':
                    unPaginate.sort((a: { director: string; }, b: { director: string; }) => (a.director.localeCompare(b.director)));
                break;

                case 'franchise':
                    unPaginate.sort((a: { franchise: string; }, b: { franchise: string; }) => (a.franchise.localeCompare(b.franchise)));
                break;
            }

            //REPAGINATE
            //jump through results in segments of 10 and create a page array each loop
                for(let i = 0; i < unPaginate.length; i += 10){
                    const page: object[] = []; 

                    //if there are 10 or more elements to go, loop through them and push them to the page array
                    if(i + 10 <= unPaginate.length){
                        for(let j = i; j < i + 10; j++){
                            page.push(unPaginate[j]);                   
                        }
                        paginatedResults.push(page); //push the pages to the paginatedResults on each loop of 10
                    }

                    //if there are less than 10 elements remaining in the results, loop through the remaining elements and push them to the page array
                    else if(i + 10 > unPaginate.length){
                        for(let j = i; j < unPaginate.length; j++){
                            page.push(unPaginate[j]);    
                        }
                        paginatedResults.push(page); //push the page to the paginatedResults
                    }
                }

                res.status(200).json({message: 'sortedResults', paginatedResults: paginatedResults});
        }
        catch(error){
            console.error(error);
        }

    }
}

export default new sortController();