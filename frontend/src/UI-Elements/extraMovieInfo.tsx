import styles from "../UI-Elements/UI_css/extraMovieInfo.module.css";
import type { Movie } from "../UI-Elements/movieCard";

/**
 * Props for the ExtraMovieInfo component.
 */
interface ExtraMovieData {
    /**
     * Movie data used to display additional details.
     * `null` indicates the data has not yet loaded.
     */
    movieData: Movie | null;
}

/**
 * ExtraMovieInfo Component
 *
 * Displays supplementary information for a movie, including:
 * - Tags / keywords
 * - Synopsis
 * - Cast list
 *
 * This component assumes the core movie details are handled elsewhere
 * and focuses only on extended descriptive data.
 *
 * @component
 * @param {ExtraMovieData} props - Component props
 * @returns {JSX.Element} Additional movie information section
 */
export default function ExtraMovieInfo(props: ExtraMovieData) {
    return (
        <section>
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>
                {props.movieData?.keywords}
            </p>

            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>
                {props.movieData?.synopsis}
            </p>

            <h3 className={styles.castHeader}>Cast:</h3>
            <p className={styles.castText}>
                {props.movieData?.cast}
            </p>
        </section>
    );
}
