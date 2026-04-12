import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";
import { useParams } from "react-router";

import type { mediaType } from "../pages/mediaSearch";
export type sortModes = 'relevance' | 'releasedate' | 'newest' | 'title' | 'director' | 'franchise' | 'firstairdate' | 'lastairdate' | 'creator';
export type useSearch = {
        handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
        handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        newSearch: (page: number) => Promise<void>,
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
        searchValue: string,
        keywords: string[];
        loading: boolean;
    };

    interface Response{
        pages: number[];
        searchResult: Movie[] | Show[];
        keywordQuery: string
    }

export default function useSearch(){
    const { mediaType } = useParams<{ mediaType: mediaType }>();
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [previousSearch, setPreviousSearch] = useState<string>('') //store the previously searched value for use in sorting and page changing
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedResults, setDisplayedResults] = useState<Movie[] | Show[]>([]); //display results
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortModes>('relevance');
    const [pages, setPages] = useState<number[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


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

    //run search every time keywords change
    useEffect(() => {
        newSearch(1);
    }, [keywords]);

    //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

        if(event.target.checked) {
            setKeywords([...keywords, value])
        } 
        else {
            setKeywords(k => k.filter(keyword => keyword !== value));
        }
    }

    
    //search function used for new searches (example: if first search was 'Evil Dead' and I then search for 'The Howling,' or if I add or remove keywords, then this code runs)
    async function newSearch(page: number){
        if(searchValue != '' || keywords.length > 0){
            encodeURIComponent(searchValue);
            const formatSearch = encodeURIComponent(searchValue);
            const keywordString = encodeURIComponent(keywords.join('+'));
            try{
                setLoading(true);
                const request = await fetch(`${import.meta.env.VITE_API_URL}/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=${page}`);
                const response: Response = await request.json();
                setPageState(response);
                setPreviousSearch(searchValue); //track the previous search value for changing pages and sorting
            } 
            catch(error){
                setErrorState();
                console.error(error);
            }
        }
    }

    //search function used for sorting and changing pages
    async function modifySearch(page: number){
        encodeURIComponent(previousSearch);
        const formatSearch = encodeURIComponent(previousSearch);
        const keywordString = encodeURIComponent(keywords.join('+'));
        try{
            setLoading(true);
            const request = await fetch(`${import.meta.env.VITE_API_URL}/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=${keywordString}&page=${page}`);
            const response: Response = await request.json();
            setPageState(response);
        } 
        catch(error){
            setErrorState();
            console.error(error);
        }
    }

    //sets page state upon successful search
    function setPageState(response: Response){
        setLoading(false);
        setError(false);
        setPages(response.pages);
        setSortMenuVisible(true);
        setDisplayedResults(response.searchResult);
    }

    //sets error status when search fails
    function setErrorState(){
        setLoading(false);
        setError(true);
    }

    //sort results
    async function sort(){
        if(previousSearch !== '' || keywords.length > 0){
            try{
                await modifySearch(1);
            } 
            catch(error){
                console.error(error);
            }
        }
    }

    //move to next or previous page
    async function changePage(page: number){
        if(previousSearch !== '' || keywords.length > 0){
            try{
                await modifySearch(page);
            }    
            catch(error){
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
        newSearch,
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
        searchValue: searchValue,
        keywords: keywords,
        loading: loading,
    }
    return searchFunctions;
}