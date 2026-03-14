import { checkSortModeAndMediaType } from './searchUtils/checkSortModeAndMediaType.js';
import { removeStopWords } from './searchUtils/removeStopWords.js';

/**
 * SearchController
 * ----------------
 * Handles full-text search for movies and shows.
 *
 * Supports:
 * - Title search (BOOLEAN MODE, prefix matching)
 * - Keyword search
 * - Combined title + keyword search
 * - Pagination
 * - Sorting (relevance + metadata fields)
 *
 * Uses MySQL FULLTEXT indexes via MATCH ... AGAINST.
 */
import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from "express";
import { db } from '../db/pool.js';

export default async function SearchController(req: Request, res: Response){

    /**
     * Query parameters
     * ----------------
     * query      → title search string
     * keywords   → keyword filter string
     * sortMode   → relevance | releasedate | title | etc
     * mediaType  → movies | shows
     * page       → current page number (1-based)
     */
    const title = String(req.query.query);
    const keywords = String(req.query.keywords);
    const sortMode = String(req.query.sortMode);
    const mediaType = String(req.query.mediaType);
    const currentPage = Number(req.query.page);
     
    /**
     * Pagination config
     */
    const limit = 10;
    const offset = (currentPage * limit) - 10;

    /**
     * Validate media type and sort mode based on media type
     * Prevents SQL injection via ORDER BY
     */
    if(checkSortModeAndMediaType(mediaType, sortMode) === false){
        return (res.status(400).json({message: 'invalid sort mode or media type'}));
    }

    /**
     * Prepare BOOLEAN MODE title query
     * Example:
     * "The Evil Dead" → "+Evil* +Dead*"
     */
    const finalizedTitle = removeStopWords(title);

    /**
     * Fetch pagination metadata and search results
     */
    const pages = await pagination();
    const searchResult = await search();
    
    if(pages.length === 0){
        return res.status(404).json({error: 'No Results Found'});        
    }
    else{
        return res.status(200).json({pages: pages, searchResult: searchResult});
    }

    // --------------------------------------------------
    // Query functions
    // --------------------------------------------------

    /**
     * Calculates total pages for pagination.
     * Uses COUNT(*) with the same MATCH condition as the search query.
     */
    async function pagination(){
        //queries
        const titleQuery = `SELECT COUNT(*) AS total FROM ${mediaType} WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) AGAINST (? IN BOOLEAN MODE)`;
        const keywordQuery = `SELECT COUNT(*) AS total FROM ${mediaType} WHERE MATCH (keywords) AGAINST (? IN BOOLEAN MODE)`;
        const titleAndKeywordQuery = `SELECT COUNT(*) AS total FROM ${mediaType} WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) AGAINST (? IN BOOLEAN MODE) AND MATCH (keywords) AGAINST (? IN BOOLEAN MODE)`;
        const formatKeywords = '+' + keywords;

        const pagesArray: number[] = [];

        try{
            if(title !== '' && keywords === ''){
                const [pages]: any[] = await db.execute(titleQuery, [finalizedTitle]);
                const numOfPages = Math.ceil(pages[0].total / limit);
                
                for(let i = 1; i <= numOfPages; i++){
                    pagesArray.push(i);
                }
            }

            else if(title === '' && keywords !== ''){
                const [pages]: any[] = await db.execute(keywordQuery, [formatKeywords]);
                const numOfPages = Math.ceil(pages[0].total / limit);
                
                for(let i = 1; i <= numOfPages; i++){
                    pagesArray.push(i);
                }
            }

            else if(title !== '' && keywords !== ''){
                const [pages]: any[] = await db.execute(titleAndKeywordQuery, [finalizedTitle, formatKeywords]);
                const numOfPages = Math.ceil(pages[0].total / limit);
                
                for(let i = 1; i <= numOfPages; i++){
                    pagesArray.push(i);
                }
            }
        }
        catch(error){
            console.error(error);
        }
        return pagesArray;
    }
    
    /**
     * Executes the actual search query.
     * Uses BOOLEAN MODE relevance scoring when sortMode === 'relevance'.
     */
    async function search(){
        //initial search queries
        const titleQuery = `SELECT *, 
                            MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) 
                            AGAINST (? IN BOOLEAN MODE) 
                            AS relevance 
                            FROM ${mediaType} 
                            WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) 
                            AGAINST (? IN BOOLEAN MODE) 
                            ORDER BY relevance DESC 
                            LIMIT ${limit} 
                            OFFSET ${offset}`;

        const keywordQuery = `SELECT *
                              FROM ${mediaType}
                              WHERE MATCH (keywords) AGAINST (? IN BOOLEAN MODE)
                              LIMIT ${limit} 
                              OFFSET ${offset}`;

        const titleAndKeywordQuery = `SELECT *, 
                                      MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) 
                                      AGAINST (? IN BOOLEAN MODE) 
                                      AS relevance 
                                      FROM ${mediaType} 
                                      WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'}) 
                                      AGAINST (? IN BOOLEAN MODE) 
                                      AND MATCH (keywords) AGAINST (? IN BOOLEAN MODE)
                                      ORDER BY relevance DESC 
                                      LIMIT ${limit} 
                                      OFFSET ${offset}`;

        //sort queries
        const titleSortQuery = `SELECT *
                                FROM ${mediaType}
                                WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'})
                                AGAINST (? IN BOOLEAN MODE)
                                ORDER BY ${sortMode === 'newest' ? 'releasedate DESC' : sortMode}
                                LIMIT ${limit}
                                OFFSET ${offset}`;

        const keywordSortQuery = `SELECT *
                                  FROM ${mediaType}
                                  WHERE MATCH (keywords)
                                  AGAINST (? IN BOOLEAN MODE)
                                  ORDER BY ${sortMode === 'newest' ? 'releasedate DESC' : sortMode}
                                  LIMIT ${limit}
                                  OFFSET ${offset}`;

        const titleAndKeywordSortQuery = `SELECT *
                                          FROM ${mediaType}
                                          WHERE MATCH (${mediaType === 'movies' ? 'title, franchise' : 'title'})
                                          AGAINST (? IN BOOLEAN MODE)
                                          AND MATCH (keywords)
                                          AGAINST (? IN BOOLEAN MODE)
                                          ORDER BY ${sortMode === 'newest' ? 'releasedate DESC' : sortMode}
                                          LIMIT ${limit}
                                          OFFSET ${offset}`;

        const formatKeywords = '+' + keywords;

        try{
            if(sortMode === 'relevance'){
                if(title !== '' && keywords === ''){
                    const [searchResult] = await db.execute(titleQuery, [finalizedTitle, finalizedTitle]);
                    return searchResult;
                }

                else if(title === '' && keywords !== ''){
                    const [searchResult] = await db.execute(keywordQuery, [formatKeywords]);
                    return searchResult;
                }

                else if(title !== '' && keywords !== ''){
                    const [searchResult] = await db.execute(titleAndKeywordQuery, [finalizedTitle, finalizedTitle, formatKeywords]);
                    return searchResult;
                }
        }

            else{
                if(title !== '' && keywords === ''){
                    const [searchResult] = await db.execute(titleSortQuery, [finalizedTitle]);
                    return searchResult;
                }

                else if(title === '' && keywords !== ''){
                    const [searchResult] = await db.execute(keywordSortQuery, [formatKeywords]);
                    return searchResult;
                }

                else if(title !== '' && keywords !== ''){
                    const [searchResult] = await db.execute(titleAndKeywordSortQuery, [finalizedTitle, formatKeywords]);
                    return searchResult;
                }
            }
        }
        catch(error){
            console.error(error);
        }
    }
}