import styles from './movies.module.css';
import type {Movie} from '../UI-Elements/movieCard'
import MovieCard from '../UI-Elements/movieCard';
import { useState } from 'react';

export default function Movies(){
    const [searchValue, setSearchValue] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [defaultMovies, setDefaultMovies] = useState<Movie[]>([]);
    const [sortOptionsToggle, setSortOptionsToggle] = useState(false);
    const [oldestHighlight, setOldestHighlight] = useState(false);
    const [newestHighlight, setNewestHighlight] = useState(false);
    const [titleHighlight, setTitleHighlight] = useState(false);
    const [directorHighlight, setDirectorHighlight] = useState(false);
    const [franchiseHighlight, setFranchiseHighlight] = useState(false);
    

    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }

    async function search(){
        const formatSearch = searchValue.replaceAll(' ', "+");
        try{
            const request = await fetch(`http://localhost:3000/api/search/movies?query=${formatSearch}`);
            const response = await request.json();
            setMovies(response.findResult);
            setDefaultMovies([...response.findResult]);
            console.log(response);
        } catch(error){
            console.error('Error searching: ', error);
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

    //render sort options if sort options are toggled on
    function SortOptions(){
        if(sortOptionsToggle === true){
            return(
                <>
                <h2 className={styles.sortBy} onClick={sortMenuToggle}>Sort by {String.fromCodePoint(128315)}</h2>
                <ul className={styles.sortOptions}>
                    <li onClick={defaultSort} style={{ textShadow: oldestHighlight ? '2px 1px red' : 'transparent'}}>Oldest</li>
                    <li onClick={releaseDateSort} style={{ textShadow: newestHighlight ? '2px 1px red' : 'transparent'}}>Newest</li>
                    <li onClick={titleSort} style={{ textShadow: titleHighlight ? '2px 1px red' : 'transparent'}}>Title</li>
                    <li onClick={directorSort} style={{ textShadow: directorHighlight ? '2px 1px red' : 'transparent'}}>Director</li>
                    <li onClick={franchiseSort} style={{ textShadow: franchiseHighlight ? '2px 1px red' : 'transparent'}}>Franchise</li>
                </ul>
                </>
                
            )
        }
        else if(sortOptionsToggle === false){
            return(
                <h2 className={styles.sortBy} onClick={sortMenuToggle}>Sort by {String.fromCodePoint(128314)}</h2>
            )
        }
    }

    //sorts
    function defaultSort(){
        //sort from oldest to newest
        setMovies(defaultMovies);
        setOldestHighlight(true);
        setNewestHighlight(false);
        setTitleHighlight(false);
        setDirectorHighlight(false);
        setFranchiseHighlight(false);
    }

    function releaseDateSort(){
        //sort from newest to oldest
         const shallowCopyMovies: Movie[] = [...defaultMovies];
         const sortByReleaseDate = shallowCopyMovies.sort((movie, nextMovie) => nextMovie.releasedate.localeCompare(movie.releasedate));
         setMovies(sortByReleaseDate);
         setOldestHighlight(false);
         setNewestHighlight(true);
         setTitleHighlight(false);
         setDirectorHighlight(false);
         setFranchiseHighlight(false);
         console.log(sortByReleaseDate);
    }

    function titleSort(){
        //sort title from A-Z
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByTitle = shallowCopyMovies.sort((movie, nextmovie) => movie.title.localeCompare(nextmovie.title));
        setMovies(sortByTitle);
        setOldestHighlight(false);
        setNewestHighlight(false);
        setTitleHighlight(true);
        setDirectorHighlight(false);
        setFranchiseHighlight(false);
        console.log(sortByTitle);
    }

    function directorSort(){
        //sort director from A-Z
        const shallowCopyMovies: Movie[] = [...defaultMovies];
        const sortByDirector = shallowCopyMovies.sort((movie, nextMovie) => movie.director.localeCompare(nextMovie.director));
        setMovies(sortByDirector);
        setOldestHighlight(false);
        setNewestHighlight(false);
        setTitleHighlight(false);
        setDirectorHighlight(true);
        setFranchiseHighlight(false);
        console.log(sortByDirector);
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
        setOldestHighlight(false);
        setNewestHighlight(false);
        setTitleHighlight(false);
        setDirectorHighlight(false);
        setFranchiseHighlight(true);
        console.log(sortByFranchise);
    }

    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <div className={styles.dropdown}>
                    
                    <SortOptions/>
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
                    />
                ))}
                </ul>
            </div>
        </>
    );
}

