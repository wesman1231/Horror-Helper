import { Link } from "react-router";
import styles from "../UI-Elements/UI_css/movieCard.module.css";

/**
 * Movie interface describing the shape of data expected by the MovieCard.
 */
export interface Movie {
    /** TMDb ID used for links and keys */
    tmdbid: number;

    /** Movie title */
    title: string;

    /** Poster image path from TMDb (nullable) */
    poster: string | null;

    /** Comma-separated list of keywords/tags (nullable) */
    keywords: string | null;

    /** Director name (nullable) */
    director: string | null;

    /** Release date string */
    releasedate: string;

    /** Franchise name (nullable) */
    franchise: string | null;

    /** Movie synopsis/description (nullable) */
    synopsis: string | null;

    /** Comma-separated list of cast members */
    cast: string;
}

/**
 * MovieCard Component
 *
 * Displays a single movie's details in a card format.
 * Includes poster image, title (with link), release date,
 * tags, director, synopsis, and franchise info.
 *
 * Uses semantic HTML with a `<ul>` for metadata and lazy-loading
 * for the poster image to improve performance.
 *
 * @component
 * @param {Movie} props - Movie data to display
 * @returns {JSX.Element} Card showing movie information
 */
export default function MovieCard(props: Movie) {
    return (
        <div className={styles.movieCard}>
            {/* Poster image */}
            <div className={styles.posterContainer}>
                <img
                    className={styles.poster}
                    src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.poster}`}
                    alt={`Poster for ${props.title}`}
                    loading="lazy"
                />
            </div>

            {/* Movie info section */}
            <div className={styles.infoContainer}>
                <h3 className={styles.movieTitle}>
                    Title:{" "}
                    <span className={styles.titleText}>
                        <Link to={`/movies/${props.tmdbid}`}>{props.title}</Link>
                    </span>
                </h3>

                <ul className={styles.info}>
                    <li className={styles.releaseDate}>
                        <span className={styles.infoHeader}>Release date: </span>{" "}
                        {props.releasedate}
                    </li>
                    <li className={styles.subgenre}>
                        <span className={styles.infoHeader}>Tags: </span>
                        {props.keywords}
                    </li>
                    <li className={styles.director}>
                        <span className={styles.infoHeader}>Director: </span>
                        {props.director}
                    </li>
                    <li className={styles.synopsis}>
                        <span className={styles.infoHeader}>Synopsis: </span>{" "}
                        {props.synopsis}
                    </li>
                    <li className={styles.franchise}>
                        <span className={styles.infoHeader}>Franchise: </span>
                        {props.franchise === null ? "none" : props.franchise}
                    </li>
                </ul>
            </div>
        </div>
    );
}
