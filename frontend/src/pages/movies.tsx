import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";

export default function Movies(){
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortMode>('releasedate');
    const [pages, setPages] = useState<number[]>([]);

    //when sortMode changes, sort results
    useEffect(() => {
        sort();
    },[sortMode])

    return(
        <>
            <SearchBar searchValue={searchValue} handleInput={handleInput} search={search} />
            {sortMenuVisible ? <SortMenu sortMode={sortMode} oldestSort={oldestSort} newestSort={newestSort} titleSort={titleSort} directorSort={directorSort} franchiseSort={franchiseSort}  /> : null}
            {error ? <NoResultsFound /> : <CardList displayedMovies={displayedMovies} />}            
            {pages.length > 0 ? <PageButtons pages={pages} changePage={changePage} /> : null}
        </>
        
    )

    //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    //search for movies
    async function search(){
        if(searchValue != ''){
            const formatSearch = searchValue.replaceAll(' ', "+");
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies/${1}?query=${formatSearch}&sortMode=${sortMode}`);
                const response = await request.json();
                
                setError(false);
                setSortMenuVisible(true);
                setDisplayedMovies(response.searchResult);
                setPages(response.pagesArray);
                console.log('pagesArray from backend:', response.pagesArray);
                console.log(displayedMovies);
                console.log(response);
            } 
            catch(error){
                setError(true);
                console.error(error);
            }
        }
    }

    async function sort(){
        if(searchValue != ''){
            const formatSearch = searchValue.replaceAll(' ', "+"); 
            try{
                    const request = await fetch(`http://localhost:3000/api/search/movies/${1}?query=${formatSearch}&sortMode=${sortMode}`);
                    const response = await request.json();
                    
                    setError(false);
                    setDisplayedMovies(response.searchResult);
                    console.log(displayedMovies);
                    console.log(response);
                } 
                catch(error){
                    setError(true);
                    console.error(error);
                }
        }
    }

    async function changePage(page: number){
        if(searchValue != ''){
            const formatSearch = searchValue.replaceAll(' ', "+"); 
        try{
                const request = await fetch(`http://localhost:3000/api/search/movies/${page}?query=${formatSearch}&sortMode=${sortMode}`);
                const response = await request.json();
                
                setError(false);
                setDisplayedMovies(response.searchResult);
                console.log(displayedMovies);
                console.log(response);
            } 
            catch(error){
                setError(true);
                console.error(error);
            }
        }
    }

    function oldestSort() {
        setSortMode(() => 'releasedate');
    }

    function newestSort() {
        setSortMode(() => 'newest');
    }

    function titleSort() {
        setSortMode(() => 'title');
    }

    function directorSort() {
        setSortMode(() => 'director');
    }

    function franchiseSort() {
        setSortMode(() => 'franchise');
    }

}

export type sortMode = 'releasedate' | 'newest' | 'title' | 'director' | 'franchise';