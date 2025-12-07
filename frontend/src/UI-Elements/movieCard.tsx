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
    synopsis: string|null,
    cast: string
}

export default function MovieCard(props: Movie){

     return(
        <div className={styles.movieCard}>
            <div className={styles.posterContainer}>
                <img className={styles.poster} src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.poster}`} />
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}> Title: <span className={styles.titleText}><Link to={`/movies/${props.tmdbId}`}>{props.title}</Link></span></h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Release date: </span> {props.releasedate}</li>
                    <li className={styles.subgenre}><span className={styles.infoHeader}>Tags: </span>{props.keywords}</li>
                    <li className={styles.director}><span className={styles.infoHeader}>Director: </span>{props.director}</li>
                    <li className={styles.synopsis}><span className={styles.infoHeader}>Synopsis: </span> {props.synopsis}</li>
                    <li className={styles.franchise}><span className={styles.infoHeader}>Franchise: </span>{props.franchise}</li>
                </ul>
            </div>
        </div>
    );
}