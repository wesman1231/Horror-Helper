import styles from './movies.module.css';
import type {Movie} from '../UI-Elements/movieCard';
import MovieCard from '../UI-Elements/movieCard';
import { useState } from 'react';

export default function Movies(){
    const [searchValue, setSearchValue] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [defaultMovies, setDefaultMovies] = useState<Movie[]>([]);
    const [sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    type SortMode = 'default' | 'newest' | 'title' | 'director' | 'franchise';
    const [sortMode, setSortMode] = useState<SortMode>('default');

    

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
            setMovies(response.findResult);
            setDefaultMovies([...response.findResult]);
            console.log(response);
        } catch(error){
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
    function defaultSort(){
        //sort from oldest to newest
        setMovies(defaultMovies);
        setSortMode('default');
    }

    function releaseDateSort(){
        //sort from newest to oldest
         const shallowCopyMovies: Movie[] = [...defaultMovies];
         const sortByReleaseDate = shallowCopyMovies.sort((movie, nextMovie) => nextMovie.releasedate.localeCompare(movie.releasedate));
         setMovies(sortByReleaseDate);
         setSortMode('newest');
    }

    function titleSort(){
        //sort title from A-Z
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByTitle = shallowCopyMovies.sort((movie, nextmovie) => movie.title.localeCompare(nextmovie.title));
        setMovies(sortByTitle);
        setSortMode('title');
    }

    function directorSort(){
        //sort director from A-Z
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByDirector = shallowCopyMovies.sort((movie, nextMovie) => movie.director.localeCompare(nextMovie.director));
        setMovies(sortByDirector);
        setSortMode('director');
    }

    function franchiseSort(){
        //sort franchise from A-Z
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByFranchise = shallowCopyMovies.sort((movie, nextMovie) => {
            const fmovie = movie.franchise || "";
            const fnextMovie = nextMovie.franchise || "";
            return fmovie.localeCompare(fnextMovie);
        });
        setMovies(sortByFranchise);
        setSortMode('franchise');
    }


    //if there are no results found, render no results found header
    if(error === true){
        return(
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <div className={styles.dropdown}>
                    {sortOptionsToggle ? (
                    <>
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128315)}
                        </h2>

                        <ul className={styles.sortOptions}>
                            <li onClick={defaultSort} style={{ textShadow: sortMode === 'default' ? '2px 1px red' : 'none' }}>
                                Oldest
                            </li>
                            <li onClick={releaseDateSort} style={{ textShadow: sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                Newest
                            </li>
                            <li onClick={titleSort} style={{ textShadow: sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                Title
                            </li>
                            <li onClick={directorSort} style={{ textShadow: sortMode === 'director' ? '2px 1px red' : 'none' }}>
                                Director
                            </li>
                            <li onClick={franchiseSort} style={{ textShadow: sortMode === 'franchise' ? '2px 1px red' : 'none' }}>
                                Franchise
                            </li>
                        </ul>
                    </>
                    ) : (
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128314)}
                        </h2>
                )}
                </div>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
                <h2 className={styles.noResultsFound}>No Results Found</h2>
            </div>
        );
    }


    //otherwise, render results
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <div className={styles.dropdown}>
                    {sortOptionsToggle ? (
                    <>
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128315)}
                        </h2>

                        <ul className={styles.sortOptions}>
                            <li onClick={defaultSort} style={{ textShadow: sortMode === 'default' ? '2px 1px red' : 'none' }}>
                                Oldest
                            </li>
                            <li onClick={releaseDateSort} style={{ textShadow: sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                Newest
                            </li>
                            <li onClick={titleSort} style={{ textShadow: sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                Title
                            </li>
                            <li onClick={directorSort} style={{ textShadow: sortMode === 'director' ? '2px 1px red' : 'none' }}>
                                Director
                            </li>
                            <li onClick={franchiseSort} style={{ textShadow: sortMode === 'franchise' ? '2px 1px red' : 'none' }}>
                                Franchise
                            </li>
                        </ul>
                    </>
                    ) : (
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128314)}
                        </h2>
                )}
                </div>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
            </div>
            <div className={styles.resultsContainer}>
                <ul className={styles.movieCardList}>
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.tmdbId}
                            tmdbId={movie.tmdbId}
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
            </div>
        </>
    );
}

