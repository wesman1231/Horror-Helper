import { Link } from 'react-router';
import styles from './movieCard.module.css';

export interface Movie{
    tmdbId: number;
    title: string,
    poster: string|null,
    keywords: string|null
    director: string,
    releasedate: string,
    franchise: string,
    synopsis: string|null
}

export default function MovieCard(movie: Movie){

     return(
        <div className={styles.movieCard}>
            <div className={styles.posterContainer}>
                <img className={styles.poster} src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movie.poster}`} />
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}> Title: <span className={styles.titleText}><Link to={`/movies/${movie.tmdbId}`}>{movie.title}</Link></span></h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Release date: </span> {movie.releasedate}</li>
                    <li className={styles.subgenre}><span className={styles.infoHeader}>Tags: </span>{movie.keywords}</li>
                    <li className={styles.director}><span className={styles.infoHeader}>Director: </span>{movie.director}</li>
                    <li className={styles.synopsis}><span className={styles.infoHeader}>Synopsis: </span> {movie.synopsis}</li>
                    <li className={styles.franchise}><span className={styles.infoHeader}>Franchise: </span>{movie.franchise}</li>
                </ul>
            </div>
        </div>
    );
}