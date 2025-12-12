import { useEffect, useState} from "react";
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
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [allPages, setAllPages] = useState<Movie[][]>([]);
    const [defaultResults, setDefaultResults] = useState<Movie[][]>([])
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortMode>('default');

    //update displayed movies when changing pages
    useEffect(() => {
        setDisplayedMovies(allPages[currentPage]|| [])
    }, [allPages, currentPage]);

    //run sort function when sortMode changes
    useEffect(() => {
    if (sortMode) {
        sort();
    }
}, [sortMode]);

    return(
        <>
            <SearchBar searchValue={searchValue} handleInput={handleInput} search={search} />
            {sortMenuVisible ? <SortMenu sortMode={sortMode} defaultSort={defaultSort} newesttSort={newestSort} titleSort={titleSort} directorSort={directorSort} franchiseSort={franchiseSort} sort={sort} /> : null}
            {error ? <NoResultsFound /> : <CardList displayedMovies={displayedMovies} />}            
            {displayedMovies ? <PageButtons allPages={allPages} currentPage={currentPage} setCurrentPage={setCurrentPage} /> : null} 
        </>
        
    )
    
     //track search bar value
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }
    
    //search for movies
    async function search(){
        const formatSearch = searchValue.replaceAll(' ', "+");
            try{
                const request = await fetch(`http://localhost:3000/api/search/movies?query=${formatSearch}`);
                const response = await request.json();
                
                setError(false);
                setDefaultResults(response.paginatedResults);
                setAllPages(response.paginatedResults)
                setDisplayedMovies(response.paginatedResults[currentPage].sort((a: Movie, b: Movie) => (a.releasedate.localeCompare(b.releasedate))));
                setSortMenuVisible(true);
                
                console.log(displayedMovies);
                console.log(response);
            } 
            catch(error){
                setError(true);
                console.error(error);
            }
    }

//sort options
function defaultSort() {
    setSortMode(() => 'default');
    setAllPages(() => defaultResults);
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

    async function sort(){
        try{
            const request = await fetch(`http://localhost:3000/api/sort/movies?sortMode=${sortMode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({arrayToSort: defaultResults})
        });
            const response = await request.json();
            const sortedResults = response.paginatedResults;
            setAllPages(sortedResults);
        }
        catch(error){
            console.error(error);
        }
    }
}

export type sortMode = 'default' | 'newest' | 'title' | 'director' | 'franchise';