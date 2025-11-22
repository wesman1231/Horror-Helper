import styles from './movieCard.module.css';

interface Movie{
    id: number,
    tmdbId: number;
    title: string,
    poster: string|null,
    subgenre: string,
    director: string,
    releaseDate: string|null,
    franchise?: string
}

export default function MovieCard(){


    return(
        <div className={styles.movieCard}>
            <div className={styles.posterContainer}>
                <img className={styles.poster} src='https://i.redd.it/vkvgykaj1b7e1.jpeg'></img>
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}>Title: The Evil Dead</h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}>Release date: October 15th, 1981</li>
                    <li className={styles.subgenre}>Subgenre: splatter/possession</li>
                    <li className={styles.director}>Director: Sam Raimi</li>
                    <li className={styles.franchise}>Franchise: Evil Dead</li>
                </ul>
            </div>
        </div>
    );
}