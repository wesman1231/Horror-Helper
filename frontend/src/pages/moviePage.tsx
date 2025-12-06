import styles from './moviePage.module.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {Movie} from '../UI-Elements/movieCard';

export default function MoviePage(){
    const { id } = useParams();
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [error, setError] = useState(false);
    const[franchiseNull, setFranchiseNull] = useState(false);

    useEffect(() => {
        //fetch movie info to render on the page
        async function getMovieInfo(){
            try{
                const fetchInfo = await fetch(`http://localhost:3000/api/movies/${id}`);
                const fetchResults = await fetchInfo.json();
                setMovieData(fetchResults[0]);
                console.log(fetchResults[0]);
                if(movieData?.franchise === null){
                    setFranchiseNull(true);
                }
            }catch(error){
                console.error('Errror fetching data: ', error)
                setError(true);
            }
        }
        getMovieInfo();
    }, [id]);
    
    //if there is an error in fetching data, return an error message
    if(error === true){
        return(
            <h2>Error, could not find movie</h2>
        );
        
    }

    return(
        <div className={styles.movieWrapper}>
            <h2 className={styles.movieTitle}>{movieData?.title}</h2>
            <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movieData?.poster}`}></img>
            <h3 className={styles.releaseDate}>Release Date: {movieData?.releasedate}</h3>
            <h3 className={styles.director}>Director: {movieData?.director}</h3>
            {franchiseNull ? (<h3 className={styles.franchise}>Franchise: {movieData?.franchise}</h3>) : <h3 className={styles.franchise}>Franchise: none</h3>}
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>{movieData?.keywords}</p>
            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>{movieData?.synopsis}</p>
        </div>
    );
}