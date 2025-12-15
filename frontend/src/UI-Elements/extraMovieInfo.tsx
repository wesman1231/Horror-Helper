import styles from '../UI-Elements/UI_css/extraMovieInfo.module.css';
import type { Movie } from '../UI-Elements/movieCard';


interface extraMovieData{
    movieData: Movie | null;
}

export default function ExtraMovieInfo(props: extraMovieData){

    return(
        <section>
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>{props.movieData?.keywords}</p>
            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>{props.movieData?.synopsis}</p>
            <h3 className={styles.castHeader}>Cast: </h3>
            <p className={styles.castText}>{props.movieData?.cast}</p>
        </section>
    );
}