import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.ts';

class SearchController{
    
    constructor() {
        this.search = this.search.bind(this);
        this.checkSortMode = this.checkSortMode.bind(this);
        this.removeStopWords = this.removeStopWords.bind(this);
        this.pagination = this.pagination.bind(this);
        this.resultQuery = this.resultQuery.bind(this);
    }

    //search for movies and shows
    public async search(req: Request, res: Response){
        
        const titleQuery = String(req.query.query).trim();
        const keywordQuery = String(req.query.keywords).trim() || null;
        const sortMode = String(req.query.sortMode);
        const mediaType = String(req.query.mediaType);

        //check if sortMode is valid before continuing
        if(this.checkSortMode(sortMode, mediaType) === false){
           return res.status(400).json({error: 'Invalid sort mode or media type'});
        }

        try{
            const currentPage: number = Number(req.query.page);
            const pagesArray: number[] = [];
            const elementsPerPage = 10;
            const offset: number = (currentPage - 1) * 10;
            const finalPagesArray = await this.pagination(mediaType, pagesArray, elementsPerPage, keywordQuery, titleQuery); //get array of pages
            const searchResult = await this.resultQuery(mediaType, sortMode, offset, elementsPerPage, this.removeStopWords(titleQuery), keywordQuery); //query database
            if(finalPagesArray !== undefined){
                if(finalPagesArray.length === 0){
                   return res.status(404).json({error: 'No Results Found'}); //if no results are found, 404 error
                }
            }
            return res.status(200).json({pages: finalPagesArray, searchResult: searchResult}); //return results
        }
        catch(error){
            console.error('error searching: ', error);
        }
            
    }

    //validate sort mode and mediatype
    checkSortMode(sortMode: string, mediaType: string){
        if(mediaType === 'movies'){
            let validSortModes = new Set(['relevance', 'releasedate', 'newest', 'title', 'director', 'franchise']);
            
            if(validSortModes.has(sortMode)){
                return true;
            }
            
            else{
                return false;
            }

        }
        
        else if(mediaType === 'shows'){
            let validSortModes = new Set(['relevance', 'firstairdate', 'lastairdate', 'title', 'creator']);
            
            if(validSortModes.has(sortMode)){
                return true;
            }
            
            else{
                return false;
            }

        }
        return false;
    }

    //remove stop words from title query
    removeStopWords(titleQuery: string){
        const formatTitleQuery = titleQuery.replaceAll('+', ' ');
            const stopWords = ['a','about','an','are','as','at','be','by','com','de','en','for','from','how','i','in','is','it','la','of','on','or','that','the','this','to','und','was','what','when','where','who','will','with','www'];
            const split = formatTitleQuery.split(' ');
            const removeStopWords = split.filter(word => !stopWords.includes(word));
            const finalTitleQueryArray: string[] = [];
            
            for(let i = 0; i < removeStopWords.length; i++){
                const split = removeStopWords[i].split('');
                split.unshift('+');
                split.push('*');
                const join = split.join('');
                finalTitleQueryArray.push(join);
            }
            const finalTitleQuery = finalTitleQueryArray.join(' ');
            return finalTitleQuery;
    }

    //handle pagination
    async pagination(mediaType: string, pagesArray: number[], elementsPerPage: number, keywordQuery: string | null, titleQuery: string){
        if(mediaType === 'movies'){
            
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

        else if(mediaType === 'shows'){
            
            if(keywordQuery != null){
                const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND keywords LIKE ?`, [this.removeStopWords(titleQuery) ,`%${keywordQuery}%`]);
                const numberOfResults: number = totalResultsQuery[0].total;
                const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
            
                for(let i = 1; i <= numberOfPages; i++){    
                    pagesArray.push(i);
                }
                return pagesArray;
            }
            
            else{
                const [totalResultsQuery]: any[] = await db.execute(`SELECT COUNT(*) AS total FROM shows WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE)`, [this.removeStopWords(titleQuery)]);
                const numberOfResults: number = totalResultsQuery[0].total;
                const numberOfPages: number = Math.ceil(numberOfResults / elementsPerPage);
            
                for(let i = 1; i <= numberOfPages; i++){    
                    pagesArray.push(i);
                }
                return pagesArray;
            }

        }
    }
    
    //handle sql queries
    async resultQuery(mediaType: string, sortMode: string, offset: number, elementsPerPage: number, titleQuery: string, keywordQuery: string | null){
        interface query{
            select: string,
            relevanceMatch: string,
            where: string,
            keywordClause: string,
            from: string,
            sortMode: string,
            limit: string,
            offset: string
        }
        
        //store query strings in an object
        const sqlQuery: query = {
            select: sortMode === 'relevance' ? 'SELECT *,' : 'SELECT *',

            relevanceMatch: mediaType === "movies"
                        ? "MATCH(title, franchise) AGAINST(?) AS relevance"
                        : "MATCH(title) AGAINST(?) AS relevance",

            from: `FROM ${mediaType}`,

            where: mediaType === "movies"
                        ? "WHERE MATCH(title, franchise) AGAINST(? IN BOOLEAN MODE)"
                        : "WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE)",

            keywordClause: `AND keywords LIKE ?`,
        
            sortMode: sortMode === 'relevance'
                ? (
                    'ORDER BY relevance DESC'
                )
                :
                sortMode === 'newest'
                    ? (
                        'ORDER BY releasedate DESC'
                    )
                    :
                    `ORDER BY ${sortMode}`,

            limit: `LIMIT ${elementsPerPage}`,
            offset: `OFFSET ${offset}`,
        }
        
        if(sortMode === 'relevance'){
            
            if(keywordQuery === null){
                const [searchResult] = await db.execute(`${sqlQuery.select} ${sqlQuery.relevanceMatch} ${sqlQuery.from} ${sqlQuery.where} ${sqlQuery.sortMode} ${sqlQuery.limit} ${sqlQuery.offset}`, [titleQuery, titleQuery]);
                return searchResult;
            }
            
            else{
                const [searchResult] = await db.execute(`${sqlQuery.select} ${sqlQuery.relevanceMatch} ${sqlQuery.from} ${sqlQuery.where} ${sqlQuery.keywordClause} ${sqlQuery.sortMode} ${sqlQuery.limit} ${sqlQuery.offset}`, [titleQuery, titleQuery, `%${keywordQuery}%`]);
                return searchResult;
            }
        }
        
        else{
            if(keywordQuery === null){
                const [searchResult] = await db.execute(`${sqlQuery.select} ${sqlQuery.from} ${sqlQuery.where} ${sqlQuery.sortMode} ${sqlQuery.limit} ${sqlQuery.offset}`, [titleQuery]);
                return searchResult;
            }
            else{
                const [searchResult] = await db.execute(`${sqlQuery.select} ${sqlQuery.from} ${sqlQuery.where} ${sqlQuery.keywordClause} ${sqlQuery.sortMode} ${sqlQuery.limit} ${sqlQuery.offset}`, [titleQuery, `%${keywordQuery}%`]);
                return searchResult;
            }
        }
    }

}

export const searchController = new SearchController();