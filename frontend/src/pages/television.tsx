import { useEffect, useState } from "react";
import type { Show } from "../UI-Elements/tvCard";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";

export type sortModeShows = 'relevance' | 'firstairdate' | 'lastairdate' | 'title' | 'creator';

export default function Shows(){
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [previousSearch, setPreviousSearch] = useState<string>('') //store the previously searched value for use in sorting and page changing
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedShows, setDisplayedShows] = useState<Show[]>([]);
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortModeShows>('relevance');
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sortMode])

    //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    //search for movies
    async function search(){
        if(searchValue != ''){
            const formatSearch = searchValue.replaceAll(' ', "+");
            try{
                const request = await fetch(`http://localhost:3000/api/search/shows?query=${formatSearch}&sortMode=${sortMode}&page=1`);
                const response = await request.json();
                
                setError(false);
                setPages(response.pagesArray);
                setPreviousSearch(searchValue);
                setSortMenuVisible(true);
                setDisplayedShows(response.searchResult);
                
                console.log('pagesArray from backend:', response.pagesArray);
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
                    const request = await fetch(`http://localhost:3000/api/search/shows?query=${formatSearch}&sortMode=${sortMode}&page=1`);
                    const response = await request.json();
                    
                    setError(false);
                    setDisplayedShows(response.searchResult);
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
                const request = await fetch(`http://localhost:3000/api/search/shows?query=${formatSearch}&sortMode=${sortMode}&page=${page}`);
                const response = await request.json();
                
                setError(false);
                setDisplayedShows(response.searchResult);
                console.log(response);
            } 
            catch(error){
                setError(true);
                console.error(error);
            }
        }
    }

    function relevanceSort(){
        setSortMode(() => 'relevance');
    }

    function firstAiredSort() {
        setSortMode(() => 'firstairdate');
    }

    function lastAiredSort() {
        setSortMode(() => 'lastairdate');
    }

    function titleSort() {
        setSortMode(() => 'title');
    }

    function creatorSort() {
        setSortMode(() => 'creator');
    }



    return(
        <>
            <SearchBar searchValue={searchValue} handleInput={handleInput} search={search} />
            {sortMenuVisible ? <SortMenu variant="shows" sortType={{sortMode: sortMode, relevanceSort, firstAiredSort, lastAiredSort, titleSort, creatorSort}} /> : null}
            {error ? <NoResultsFound /> : <CardList variant={'shows'} results={displayedShows} />}            
            {pages.length > 0 ? <PageButtons pages={pages} changePage={changePage} previousSearch={previousSearch} /> : null}
        </>
    );
}

