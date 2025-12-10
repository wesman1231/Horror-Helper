import { useState, lazy, Suspense, useEffect, useCallback } from 'react';
import styles from './movies.module.css';
import type {Movie} from '../UI-Elements/movieCard';
const MovieCard = lazy(() => import("../UI-Elements/movieCard"));
import LoadingCard from '../UI-Elements/loadingCard';

export default function Movies(){
    const [searchValue, setSearchValue] = useState<string>(''); //search bar state
    const [movies, setMovies] = useState<Movie[]>([]); //displayed movies
    const [defaultMovies, setDefaultMovies] = useState<Movie[]>([]); //default sorted movies(oldest to newest)
    const [sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false); //sort options toggle
    const [error, setError] = useState<boolean>(false); //check for an error
    const [sortButtonVisible, setSortButtonVisible] = useState<boolean>(false); //checks if sort button should be visible
    const [currentPage, setCurrentPage] = useState<number>(0); //tracks the current oage number
    const [numberOfPages, setNumberOfPages] = useState<number[]>([]); //defines the number of pages as an array of numbers, from 0 to the length of the fullResults
    const [fullResults, setFullResults] = useState<Movie[][]>([]); //the full array of results with subarrays for each page
    
    type SortMode = 'default' | 'newest' | 'title' | 'director' | 'franchise';
    const [sortMode, setSortMode] = useState<SortMode>('default');

    //rerender new page elements when page changes
    useEffect(() => {
        const page = fullResults[currentPage] || [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDefaultMovies(page.sort((movie, nextMovie) => (movie.releasedate.localeCompare(nextMovie.releasedate)))); //when page changes, defaultMovies is assigned to the currentPage index of fullResults, which is always in the base sort of oldest-newest movies
    }, [fullResults, currentPage])
    
    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }

    async function search(){
        //search for movies
        const formatSearch = searchValue.replaceAll(' ', "+");
        try{
            const request = await fetch(`http://localhost:3000/api/search/movies?query=${formatSearch}`);
            const response = await request.json();
            
            setError(false);
            setSortButtonVisible(true);
            setNumberOfPages(response.pageinatedResults.map((movie: object) => response.pageinatedResults.indexOf(movie) + 1));
            setFullResults(response.pageinatedResults)
            setCurrentPage(0);
            console.log(response);
        } 
        catch(error){
            setError(true);
            console.error(error);
        }
    }

    //toggle sort options menu
    function sortMenuToggle(){
        if(sortOptionsToggle === false){
            setSortOptionsToggle(true);
        }
        else if(sortOptionsToggle === true){
            setSortOptionsToggle(false);
        }
    }

    //sorts
    const defaultSort = useCallback(() => {
        setMovies(defaultMovies);
        setSortMode('default');
    }, [defaultMovies]);

    const releaseDateSort = useCallback(() => {
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByReleaseDate = shallowCopyMovies.sort((movie, nextMovie) =>
            nextMovie.releasedate.localeCompare(movie.releasedate)
        );
        setMovies(sortByReleaseDate);
        setSortMode('newest');
    }, [defaultMovies]);

    const titleSort = useCallback(() => {
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByTitle = shallowCopyMovies.sort((movie, nextmovie) =>
            movie.title.localeCompare(nextmovie.title)
        );
        setMovies(sortByTitle);
        setSortMode('title');
    }, [defaultMovies]);

    const directorSort = useCallback(() => {
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByDirector = shallowCopyMovies.sort((movie, nextMovie) =>
            movie.director.localeCompare(nextMovie.director)
        );
        setMovies(sortByDirector);
        setSortMode('director');
    }, [defaultMovies]);

    const franchiseSort = useCallback(() => {
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByFranchise = shallowCopyMovies.sort((movie, nextMovie) => {
            const fmovie = movie.franchise || "";
            const fnextMovie = nextMovie.franchise || "";
            return fmovie.localeCompare(fnextMovie);
        });
        setMovies(sortByFranchise);
        setSortMode('franchise');
    }, [defaultMovies]);


    //sort page elements when sortMode changes, when page changes, this will automatically set the correct sort on the new page since it is initially always the default sort
    useEffect(() => {
        switch(sortMode){
            case 'default':
                // eslint-disable-next-line react-hooks/set-state-in-effect
                defaultSort();
            break;

            case 'newest':
                releaseDateSort();
            break;

            case 'title':
                titleSort();
            break;

            case 'director':
                directorSort();
            break;

            case 'franchise':
                franchiseSort();
            break
        }
    }, [sortMode, directorSort, releaseDateSort, titleSort, franchiseSort, defaultSort]);

    //if there are no results found, render no results found header
    if(error === true){
        return(
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
                <h2 className={styles.noResultsFound}>No Results Found</h2>
            </div>
        );
    }

    //if a search has been performed, include sorting options in render result
    if(sortButtonVisible){
        return(
            <>
                <div className={styles.searchBarContainer}>
                    <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                    <div className={styles.dropdown}>
                        {sortOptionsToggle ? (
                        <>
                            <button className={styles.sortBy} onClick={sortMenuToggle}>
                                Sort by {String.fromCodePoint(128315)}
                            </button>

                            <ul className={styles.sortOptions}>
                                <li>
                                    <button onClick={defaultSort} style={{ textShadow: sortMode === 'default' ? '2px 1px red' : 'none' }}>
                                        Oldest
                                    </button>
                                </li>
                                <li>
                                    <button onClick={releaseDateSort} style={{ textShadow: sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                        Newest
                                    </button>
                                </li>
                                <li>
                                    <button onClick={titleSort} style={{ textShadow: sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                        Title
                                    </button>
                                </li>
                                <li>
                                    <button onClick={directorSort} style={{ textShadow: sortMode === 'director' ? '2px 1px red' : 'none' }}>
                                        Director
                                    </button>
                                </li>
                                <li>
                                    <button onClick={franchiseSort} style={{ textShadow: sortMode === 'franchise' ? '2px 1px red' : 'none' }}>
                                        franchise
                                    </button>
                                </li>
                            </ul>
                        </>
                        ) : (
                            <button className={styles.sortBy} onClick={sortMenuToggle}>
                                Sort by {String.fromCodePoint(128314)}
                            </button>
                    )}
                    </div>
                    <button type='button' className={styles.searchButton} onClick={search}>search</button>
                </div>
                <div className={styles.resultsContainer}>
                    <Suspense fallback={<LoadingCard/>}>
                        <ul className={styles.movieCardList}>
                        {movies.map(movie => (
                            <MovieCard
                                key={movie.tmdbid}
                                tmdbid={movie.tmdbid}
                                poster={movie.poster}
                                title={movie.title}
                                releasedate={movie.releasedate}
                                keywords={movie.keywords}
                                director={movie.director ? movie.director: "unknown"}
                                synopsis={movie.synopsis}
                                franchise={movie.franchise ? movie.franchise: "none"}
                                cast={movie.cast}
                            />
                        ))}
                        </ul>  
                    </Suspense>
                </div>
                <ul className={styles.pageButtons}>
                    {numberOfPages.map((page) => (
                        <button key={page} onClick={() => setCurrentPage(page - 1)}>{page}</button>
                    ))}
                </ul>
            </>
        );
    }

    //otherwise, render default page
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
            </div>
        </>
    );
}

