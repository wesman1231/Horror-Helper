import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.ts';

class SearchController{
    
    constructor() {
        this.searchMovies = this.searchMovies.bind(this);
        this.searchTV = this.searchTV.bind(this);
        this.checkSortModeMovies = this.checkSortModeMovies.bind(this);
        this.paginationMovies = this.paginationMovies.bind(this);
        this.paginationShows = this.paginationShows.bind(this);
        this.removeStopWords = this.removeStopWords.bind(this);
        this.resultQueryMovies = this.resultQueryMovies.bind(this);
        this.resultQueryShows = this.resultQueryShows.bind(this);
    }

   

    //search for movies
    public async searchMovies(req: Request, res: Response){
        
        const titleQuery = String(req.query.query).trim();
        const keywordQuery = String(req.query.keywords).trim() || null;
        const sortMode = String(req.query.sortMode);

        //check if sortMode is valid before continuing
        if(this.checkSortModeMovies(sortMode) === false){
           return res.status(400).json({error: 'Invalid sort mode'});
        }

        try{
            const currentPage: number = Number(req.query.page);
            const pagesArray: number[] = [];
            const elementsPerPage = 10;
            const offset: number = (currentPage - 1) * 10;
            const finalPagesArray = await this.paginationMovies(pagesArray, elementsPerPage, keywordQuery, titleQuery);
            const searchResult = await this.resultQueryMovies(sortMode, offset, elementsPerPage, titleQuery, keywordQuery);
                    
             res.status(200).json({pages: finalPagesArray, searchResult: searchResult});
        }
        catch(error){
                console.error('error searching: ', error);
        }
            
    }

    
    //search for shows
    public async searchTV(req: Request, res: Response) {
    const titleQuery = String(req.query.query || '').trim(), keywordQuery = String(req.query.keywords || '').trim() || null, sortMode = String(req.query.sortMode);
    if(this.checkSortModeShows(sortMode) === false){
        return res.status(400).json({error: 'Invalid sort mode'});
    }

    try {
        const currentPage: number = Number(req.query.page);
            const pagesArray: number[] = [];
            const elementsPerPage = 10;
            const offset: number = (currentPage - 1) * 10;
            const finalPagesArray = await this.paginationShows(pagesArray, elementsPerPage, keywordQuery, titleQuery);
            const searchResult = await this.resultQueryShows(sortMode, offset, elementsPerPage, titleQuery, keywordQuery);
            res.status(200).json({pages: finalPagesArray, searchResult: searchResult});
    } catch (error) {
        console.error('error searching: ', error);
    }
    }


    checkSortModeMovies(sortMode: string){
        const validSortMode: string[] = ['relevance', 'releasedate', 'newest', 'title', 'director', 'franchise'];
        if(validSortMode.includes(sortMode)){
            return true;
        }
        else{
            return false;
        }
    }

    checkSortModeShows(sortMode: string){
        const validSortMode: string[] = ['relevance', 'firstairdate', 'lastairdate', 'title', 'creator'];
        if(validSortMode.includes(sortMode)){
            return true;
        }
        else{
            return false;
        }
    }
    
    //remove all stop words from search query and add + and * modifiers to query
    removeStopWords(titleQuery: string){
        const formatTitleQuery = titleQuery.replaceAll('+', ' ');
            const stopWords = ['a','about','an','are','as','at','be','by','com','de','en','for','from','how','i','in','is','it','la','of','on','or','that','the','this','to','und','was','what','when','where','who','will','with','www'];
            const split = formatTitleQuery.split(' ');
            const removeStopWords = split.filter(word => !stopWords.includes(word));
            const finalTitleQueryArray: string[] = [];
            
            for(let i = 0; i < removeStopWords.length; i++){
                const split = removeStopWords[i].split('');
                split.unshift('+');
                split.push('*')
                const join = split.join('');
                finalTitleQueryArray.push(join);
            }
            const finalTitleQuery = finalTitleQueryArray.join(' ');
            return finalTitleQuery;
    }

    //handle pagination
    async paginationMovies(pagesArray: number[], elementsPerPage: number, keywordQuery: string | null, titleQuery: string){
        if(keywordQuery != null){
            const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ?`, [this.removeStopWords(titleQuery) ,`%${keywordQuery}%`]);
            const numberOfResults: number = totalResultsQuery[0].total;
            const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
        
            for(let i = 1; i <= numberOfPages; i++){    
                pagesArray.push(i);
            }
            return pagesArray;
        }
        else{
            const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE)`, [this.removeStopWords(titleQuery)]);
            const numberOfResults: number = totalResultsQuery[0].total;
            const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
        
            for(let i = 1; i <= numberOfPages; i++){    
                pagesArray.push(i);
            }
            return pagesArray;
        }
    }

    async paginationShows(pagesArray: number[], elementsPerPage: number, keywordQuery: string | null, titleQuery: string){
        if(keywordQuery != null){
            const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ?`, [this.removeStopWords(titleQuery) ,`%${keywordQuery}%`]);
            const numberOfResults: number = totalResultsQuery[0].total;
            const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
        
            for(let i = 1; i <= numberOfPages; i++){    
                pagesArray.push(i);
            }
            return pagesArray;
        }
        else{
            const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE)`, [this.removeStopWords(titleQuery)]);
            const numberOfResults: number = totalResultsQuery[0].total;
            const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
        
            for(let i = 1; i <= numberOfPages; i++){    
                pagesArray.push(i);
            }
            return pagesArray;
        }
    }

    //handle search result queries
    async resultQueryMovies(sortMode: string, offset: number, elementsPerPage: number, titleQuery: string, keywordQuery: string | null){
        if(keywordQuery === null){
            if(sortMode === 'relevance'){
            const [searchResult]: any[] = await db.execute(`SELECT *,
                                                            MATCH(title, franchise) AGAINST(?) AS relevance 
                                                            FROM movies 
                                                            WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE)
                                                            ORDER BY relevance DESC
                                                            LIMIT ${elementsPerPage}
                                                            OFFSET ${offset}`, [this.removeStopWords(titleQuery), this.removeStopWords(titleQuery)]);
                                                            return searchResult;
                            
                        }
            else if(sortMode === 'newest'){
                const [searchResult]: any[] = await db.execute(`SELECT * FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) ORDER BY releasedate DESC LIMIT ${elementsPerPage} OFFSET ${offset}`, [this.removeStopWords(titleQuery)]);
                return searchResult;
            }
            else{
                const [searchResult]: any[] = await db.execute(`SELECT * FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) ORDER BY ${sortMode} LIMIT ${elementsPerPage} OFFSET ${offset}`, [this.removeStopWords(titleQuery)]);
                return searchResult;
            }
            
        }
        else{
            if(sortMode === 'relevance'){
            const [searchResult]: any[] = await db.execute(`SELECT *,
                                                            MATCH(title, franchise) AGAINST(?) AS relevance 
                                                            FROM movies 
                                                            WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ?
                                                            ORDER BY relevance DESC
                                                            LIMIT ${elementsPerPage}
                                                            OFFSET ${offset}`, [this.removeStopWords(titleQuery), this.removeStopWords(titleQuery), `%${keywordQuery}%`]);
                                                            return searchResult;
                            
                        }
            else if(sortMode === 'newest'){
                const [searchResult]: any[] = await db.execute(`SELECT * FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ? ORDER BY releasedate DESC LIMIT ? OFFSET ?`, [this.removeStopWords(titleQuery), `%${keywordQuery}%`, elementsPerPage, offset]);
                return searchResult;
            }
            else{
                const [searchResult]: any[] = await db.execute(`SELECT * FROM movies WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ? ORDER BY ${sortMode} LIMIT ? OFFSET ?`, [this.removeStopWords(titleQuery), `%${keywordQuery}%`, elementsPerPage, offset]);
                return searchResult;
            }
        }
    }

    //handle search result queries
    async resultQueryShows(sortMode: string, offset: number, elementsPerPage: number, titleQuery: string, keywordQuery: string | null){
        if(keywordQuery === null){
            if(sortMode === 'relevance'){
            const [searchResult]: any[] = await db.execute(`SELECT *,
                                                            MATCH(title) AGAINST(?) AS relevance 
                                                            FROM shows 
                                                            WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE)
                                                            ORDER BY relevance DESC
                                                            LIMIT ${elementsPerPage}
                                                            OFFSET ${offset}`, [this.removeStopWords(titleQuery), this.removeStopWords(titleQuery)]);
                                                            return searchResult;
                            
                        }
            else if(sortMode === 'newest'){
                const [searchResult]: any[] = await db.execute(`SELECT * FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) ORDER BY releasedate DESC LIMIT ${elementsPerPage} OFFSET ${offset}`, [this.removeStopWords(titleQuery)]);
                return searchResult;
            }
            else{
                const [searchResult]: any[] = await db.execute(`SELECT * FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) ORDER BY ${sortMode} LIMIT ${elementsPerPage} OFFSET ${offset}`, [this.removeStopWords(titleQuery)]);
                return searchResult;
            }
            
        }
        else{
            if(sortMode === 'relevance'){
            const [searchResult]: any[] = await db.execute(`SELECT *,
                                                            MATCH(title) AGAINST(?) AS relevance 
                                                            FROM shows 
                                                            WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ?
                                                            ORDER BY relevance DESC
                                                            LIMIT ${elementsPerPage}
                                                            OFFSET ${offset}`, [this.removeStopWords(titleQuery), this.removeStopWords(titleQuery), `%${keywordQuery}%`]);
                                                            return searchResult;
                            
                        }
            else if(sortMode === 'newest'){
                const [searchResult]: any[] = await db.execute(`SELECT * FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ? ORDER BY releasedate DESC LIMIT ? OFFSET ?`, [this.removeStopWords(titleQuery), `%${keywordQuery}%`, elementsPerPage, offset]);
                return searchResult;
            }
            else{
                const [searchResult]: any[] = await db.execute(`SELECT * FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ? ORDER BY ${sortMode} LIMIT ? OFFSET ?`, [this.removeStopWords(titleQuery), `%${keywordQuery}%`, elementsPerPage, offset]);
                return searchResult;
            }
        }
    }
}

export const searchController = new SearchController();