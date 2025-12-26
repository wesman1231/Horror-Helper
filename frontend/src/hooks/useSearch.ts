import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";
import { useParams } from "react-router";

import type { mediaType } from "../pages/mediaSearch";
export type sortModes = 'relevance' | 'releasedate' | 'newest' | 'title' | 'director' | 'franchise' | 'firstairdate' | 'lastairdate' | 'creator';

export default function useSearch(){
    const { mediaType } = useParams<{ mediaType: mediaType }>();
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [previousSearch, setPreviousSearch] = useState<string>('') //store the previously searched value for use in sorting and page changing
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedResults, setDisplayedResults] = useState<Movie[] | Show[]>([]); //display results
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortModes>('relevance');
    const [pages, setPages] = useState<number[]>([]);

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
    }, [mediaType])

    //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    //search for movies
    async function search(){
        if(searchValue != ''){
            const formatSearch = searchValue.replaceAll(' ', "+");
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=1`);
                const response = await request.json();
                
                setError(false);
                setPages(response.pages);
                setSortMenuVisible(true);
                setPreviousSearch(searchValue);
                setDisplayedResults(response.searchResult);
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
        if(previousSearch != ''){
            const formatSearch = previousSearch.replaceAll(' ', "+"); 
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=1`);
                const response = await request.json();
                
                setError(false);
                setDisplayedResults(response.searchResult);
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
        if(previousSearch != ''){
            const formatSearch = previousSearch.replaceAll(' ', "+"); 
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=${mediaType}&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=${page}`);
                const response = await request.json();
                
                setError(false);
                setDisplayedResults(response.searchResult);
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

    const searchFunctions = {
        handleInput: handleInput,
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