import styles from '../pages/pages_css/newReleases.module.css'
import { useEffect, useState } from 'react';
import type { Movie } from '../UI-Elements/movieCard';

export default function NewReleases(){
    const currentDate: Date = new Date();    

    const [movies, setMovies] = useState<Movie[] | null>([]);

    async function getNewMovies(){
        const fetchNewMovies = await fetch('http://localhost:3000/api/movies/new-releases');
        const movieResults: Movie[] = await fetchNewMovies.json();
        setMovies(movieResults);
    }

    async function getNewShows(){

    }

    //fetch all movies and shows with current year release date
    useEffect(() => {
        
    }, []);

    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
            <nav className={styles.contentNav}>
                <button onClick={() => getNewMovies}>Movies</button>
                <button onClick={() => getNewShows}>Shows</button>
            </nav>
        </>
    )
}