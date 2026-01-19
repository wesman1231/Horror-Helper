import { Link } from "react-router";
import styles from "../UI-Elements/UI_css/tvCard.module.css";

/**
 * Show Interface
 *
 * Represents a TV show object used in TVCard component
 */
export interface Show {
    tmdbid: number;
    title: string;
    poster: string | null;
    keywords: string | null;
    firstairdate: string;
    lastairdate: string;
    seasons: number;
    episodes: number;
    creator: string | null;
    synopsis: string;
}

/**
 * TVCard Component
 *
 * Displays a summary card for a TV show, including poster, title, dates, seasons, episodes, tags, creator, and synopsis.
 * The title links to the show's dedicated page.
 *
 * @param {Show} props - The show data to display
 * @returns {JSX.Element} TV show card
 */
export default function TVCard(props: Show) {
    return (
        <div className={styles.showCard}>
            <div className={styles.posterContainer}>
                <img
                    className={styles.poster}
                    src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.poster}`}
                    alt={`Poster for ${props.title}`}
                    loading="lazy"
                />
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.showTitle}>
                    Title:{" "}
                    <span className={styles.titleText}>
                        <Link to={`/shows/${props.tmdbid}`}>{props.title}</Link>
                    </span>
                </h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}>
                        <span className={styles.infoHeader}>Premiere date: </span>
                        {props.firstairdate}
                    </li>
                    <li className={styles.releaseDate}>
                        <span className={styles.infoHeader}>Finale date: </span>
                        {props.lastairdate}
                    </li>
                    <li className={styles.releaseDate}>
                        <span className={styles.infoHeader}>Seasons: </span>
                        {props.seasons}
                    </li>
                    <li className={styles.releaseDate}>
                        <span className={styles.infoHeader}>Episodes: </span>
                        {props.episodes}
                    </li>
                    <li className={styles.subgenre}>
                        <span className={styles.infoHeader}>Tags: </span>
                        {props.keywords}
                    </li>
                    <li className={styles.director}>
                        <span className={styles.infoHeader}>Created by: </span>
                        {props.creator || "unknown"}
                    </li>
                    <li className={styles.synopsis}>
                        <span className={styles.infoHeader}>Synopsis: </span>
                        {props.synopsis}
                    </li>
                </ul>
            </div>
        </div>
    );
}
