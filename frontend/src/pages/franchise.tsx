import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MovieCard from "../UI-Elements/movieCard";
import type { Movie } from "../UI-Elements/movieCard";
import styles from './pages_css/franchise.module.css';

export default function Franchise(){
    const { franchiseName } = useParams();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState<string>('');

    async function fetchFranchise(){
        try{
            const getFranchise = await fetch(`http://localhost:3000/api/movies/franchises/${franchiseName}`);
            const franchiseInfo = await getFranchise.json();
            setMovies(franchiseInfo.movies);
        }
        catch(error){
            console.error(error);
            setError(String(error));
        }
    }

    //fetch franchise info
    useEffect(() => {
        const loadData = async () => {
            await fetchFranchise();
        };
        loadData();
    }, [franchiseName]);

    return(
        <div className={styles.pageContainer}>
            <h1 className={styles.franchiseName}>{franchiseName?.replaceAll('+', ' ')}</h1>
                <ul className={styles.movieList}>
                {movies.map((movie => 
                    <li key={movie.tmdbid}>
                        <MovieCard tmdbid={movie.tmdbid} 
                                   title={movie.title} 
                                   poster={movie.poster} 
                                   keywords={movie.keywords} 
                                   director={movie.director} 
                                   releasedate={movie.releasedate} 
                                   synopsis={movie.synopsis} 
                                   franchise={movie.franchise}
                                   cast={movie.cast}/>
                    </li>
                ))}
            </ul>
            {error !== '' ? <span>{error}</span> : null}
        </div>
    )
}