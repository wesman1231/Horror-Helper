import styles from './movieCard.module.css';

export interface Movie{
    tmdbId: number;
    title: string,
    poster: string|null,
    subgenre: string|null
    director: string|null,
    releasedate: string|null,
    franchise: string|null
}

export default function MovieCard(movie: Movie){

     return(
        <div className={styles.movieCard}>
            <div className={styles.posterContainer}>
                <img className={styles.poster} src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movie.poster}`}></img>
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}>Title: {movie.title}</h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}>Release date: {movie.releasedate}</li>
                    <li className={styles.subgenre}>Subgenre: {movie.subgenre}</li>
                    <li className={styles.director}>Director: {movie.director}</li>
                    <li className={styles.franchise}>Franchise: {movie.franchise}</li>
                </ul>
            </div>
        </div>
    );
}