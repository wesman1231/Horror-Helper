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
                <img className={styles.poster} src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movie.poster}`}></img>
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}>Title: <span className={styles.titleText}>{movie.title}</span></h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Release date: </span> {movie.releasedate}</li>
                    <li className={styles.subgenre}><span className={styles.infoHeader}>Tags: </span>{movie.keywords}</li>
                    <li className={styles.director}>Director: {movie.director}</li>
                    <li className={styles.synopsis}>Synopsis: {movie.synopsis}</li>
                    <li className={styles.franchise}>Franchise: {movie.franchise}</li>
                </ul>
            </div>
        </div>
    );
}