import { useEffect, useState, useRef } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";
import { useParams } from "react-router";

import type { mediaType } from "../pages/mediaSearch";
export type sortModes = 'relevance' | 'releasedate' | 'newest' | 'title' | 'director' | 'franchise' | 'firstairdate' | 'lastairdate' | 'creator';
export type useSearch = {
        handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
        handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        search: () => void,
        sort: () => void,
        changePage: (page: number) => void,
        relevanceSort: () => void,
        titleSort: () => void,
        oldestSort: () => void,
        newestSort: () => void,
        directorSort: () => void,
        franchiseSort: () => void,
        firstAiredSort: () => void,
        lastAiredSort: () => void,
        creatorSort: () => void,
        pages: number[],
        sortMode: sortModes,
        previousSearch: string,
        displayedResults: Movie[] | Show[],
        error: boolean,
        sortMenuVisible: boolean,
        searchValue: string
    };

export default function useSearch(){
    const { mediaType } = useParams<{ mediaType: mediaType }>();
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [previousSearch, setPreviousSearch] = useState<string>('') //store the previously searched value for use in sorting and page changing
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedResults, setDisplayedResults] = useState<Movie[] | Show[]>([]); //display results
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortModes>('relevance');
    const [pages, setPages] = useState<number[]>([]);
    const keywordsRef = useRef<string[]>([]);

    //run sort function when sortMode changes
    useEffect(() => {
        sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sortMode])

    //reset page display when mediaType changes
    useEffect(() => {
        setDisplayedResults([]);
        setSortMenuVisible(false);
        setPages([]);
        setSearchValue('');
    }, [mediaType]);

    //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (event.target.checked) {
        keywordsRef.current.push(value);
    } else {
        keywordsRef.current = keywordsRef.current.filter(k => k !== value);
    }
}

    
    //search for media
    async function search(){
        if(searchValue != ''){
            encodeURIComponent(searchValue);
            const formatSearch = encodeURIComponent(searchValue);
            const keywordString = encodeURIComponent(keywordsRef.current.join('|'));
            console.log(keywordString);
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=1`);
                console.log(`http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=1`);
                const response = await request.json();
                    
                setError(false);
                setPages(response.pages);
                setSortMenuVisible(true);
                setPreviousSearch(searchValue);
                setDisplayedResults(response.searchResult);
                console.log(response.keywordQuery);
                console.log(response);
            } 
            catch(error){
                setError(true);
                console.error(error);
            }
        }
    }

    //sort results
async function sort(){
    if(previousSearch !== ''){
        const formatSearch = encodeURIComponent(previousSearch);
        const keywordString = encodeURIComponent(keywordsRef.current.join('|')); // include keywords
        try{
            const request = await fetch(
                `http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=1`
            );
            const response = await request.json();
            
            setError(false);
            setDisplayedResults(response.searchResult);
            setPages(response.pages); // optionally update pages
            console.log(response);
        } 
        catch(error){
            setError(true);
            console.error(error);
        }
    }
}

//move to next or previous page
async function changePage(page: number){
    if(previousSearch !== ''){
        const formatSearch = encodeURIComponent(previousSearch);
        const keywordString = encodeURIComponent(keywordsRef.current.join('|')); // include keywords
        try{
            const request = await fetch(
                `http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=${page}`
            );
            const response = await request.json();
        
            setError(false);
            setDisplayedResults(response.searchResult);
            setPages(response.pages); // update pages
            console.log(response);
        }    
        catch(error){
            setError(true);
            console.error(error);
        }
    }
}


    //shared sort modes
    function relevanceSort(){
        setSortMode(() => 'relevance');
    }

    function titleSort() {
        setSortMode(() => 'title');
    }

    //movie sort modes
    function oldestSort() {
        setSortMode(() => 'releasedate');
    }

    function newestSort() {
        setSortMode(() => 'newest');
    }
 
    function directorSort() {
        setSortMode(() => 'director');
    }

    function franchiseSort() {
        setSortMode(() => 'franchise');
    }

    //tv sort modes
    function firstAiredSort() {
        setSortMode(() => 'firstairdate');
    }

    function lastAiredSort() {
        setSortMode(() => 'lastairdate');
    }

    function creatorSort() {
        setSortMode(() => 'creator');
    }

    

    const searchFunctions: useSearch = {
        handleInput,
        handleCheckboxChange,
        search,
        sort,
        changePage,
        relevanceSort,
        titleSort,
        oldestSort,
        newestSort,
        directorSort,
        franchiseSort,
        firstAiredSort,
        lastAiredSort,
        creatorSort,
        pages: pages,
        sortMode: sortMode,
        previousSearch: previousSearch,
        displayedResults: displayedResults,
        error: error,
        sortMenuVisible: sortMenuVisible,
        searchValue: searchValue
    }
    return searchFunctions;
}