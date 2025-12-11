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
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [allPages, setAllPages] = useState<Movie[][]>([]);
    const [sortMenuVisible, setSortMenuVisible] = useState<boolean>(false);
    const [sortMode, setSortMode] = useState<sortMode>('default');

    //update displayed movies when changing pages
    useEffect(() => {
        setDisplayedMovies(allPages[currentPage]|| [])
    }, [allPages, currentPage]);

    

    return(
        <>
            <SearchBar searchValue={searchValue} handleInput={handleInput} search={search} />
            {sortMenuVisible ? <SortMenu sortMode={sortMode} defaultSort={defaultSort} newesttSort={newestSort} titleSort={titleSort} directorSort={directorSort} franchiseSort={franchiseSort} /> : null}
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

    //sort from oldest to newest
    function defaultSort(){
        const shallowCopyPage = [...displayedMovies];
        const defaultSort = shallowCopyPage.sort((a, b) => (a.releasedate.localeCompare(b.releasedate)));
        setDisplayedMovies(defaultSort);
        setSortMode('default');
    }

    function newestSort(){
        const shallowCopyPage = [...displayedMovies];
        const newestSort = shallowCopyPage.sort((a, b) => (b.releasedate.localeCompare(a.releasedate)));
        setDisplayedMovies(newestSort)
        setSortMode('newest');
    }

    function titleSort(){
        const shallowCopyPage = [...displayedMovies];
        const titleSort = shallowCopyPage.sort((a, b) => (a.title.localeCompare(b.title)));
        setDisplayedMovies(titleSort);
        setSortMode('title');
    }

    function directorSort(){
        const shallowCopyPage = [...displayedMovies];
        const directorSort = shallowCopyPage.sort((a, b) => (a.director.localeCompare(b.director)));
        setDisplayedMovies(directorSort);
        setSortMode('director');
    }

    function franchiseSort(){
        const shallowCopyPage = [...displayedMovies];
        const franchiseSort = shallowCopyPage.sort((a, b) => (a.franchise.localeCompare(b.franchise)));
        setDisplayedMovies(franchiseSort);
        setSortMode('franchise');
    }
    
}

export type sortMode = 'default' | 'newest' | 'title' | 'director' | 'franchise';

    
