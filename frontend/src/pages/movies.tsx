import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";

export type sortModeMovies = 'relevance' | 'releasedate' | 'newest' | 'title' | 'director' | 'franchise';

export default function Movies(){
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [previousSearch, setPreviousSearch] = useState<string>('') //store the previously searched value for use in sorting and page changing
    const [error, setError] = useState<boolean>(false); //check for an error
    const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortModeMovies>('relevance');
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
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=movies&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=1`);
                const response = await request.json();
                
                setError(false);
                setPages(response.pages);
                setSortMenuVisible(true);
                setPreviousSearch(searchValue);
                setDisplayedMovies(response.searchResult);
                
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
                    const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=movies&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=1`);
                    const response = await request.json();
                    
                    setError(false);
                    setDisplayedMovies(response.searchResult);
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
                const request = await fetch(`http://localhost:3000/api/search/movies?mediaType=movies&query=${formatSearch}&sortMode=${sortMode}&keywords=&page=${page}`);
                const response = await request.json();
                
                setError(false);
                setDisplayedMovies(response.searchResult);
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

    return(
        <>
            <SearchBar searchValue={searchValue} handleInput={handleInput} search={search} />
            {sortMenuVisible ? <SortMenu variant="movies" sortType={{sortMode: sortMode, relevanceSort, oldestSort, newestSort, titleSort, directorSort, franchiseSort}} /> : null}
            {error ? <NoResultsFound /> : <CardList variant={'movies'} results={displayedMovies} />}            
            {pages.length > 0 ? <PageButtons pages={pages} changePage={changePage} previousSearch={previousSearch} sortMode={sortMode} /> : null}
        </>
    );
}

