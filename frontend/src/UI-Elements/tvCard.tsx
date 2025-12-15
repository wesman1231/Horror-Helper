import { Link } from 'react-router';
import styles from '../UI-Elements/UI_css/tvCard.module.css';

export interface Show{
    tmdbid: number;
    title: string,
    poster: string|null,
    keywords: string|null
    firstairdate: string,
    lastairdate: string,
    seasons: number,
    episodes: number,
    creator: string|null,
    synopsis: string
}

export default function TVCard(props: Show){

     return(
        <div className={styles.showCard}>
            <div className={styles.posterContainer}>
                <img className={styles.poster} src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.poster}`} />
            </div>
            <div className={styles.infoContainer}>
                <h3 className={styles.showTitle}> Title: <span className={styles.titleText}><Link to={`/shows/${props.tmdbid}`}>{props.title}</Link></span></h3>
                <ul className={styles.info}>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Premiere date: </span> {props.firstairdate}</li>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Finale date: </span> {props.lastairdate}</li>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Seasons: </span> {props.seasons}</li>
                    <li className={styles.releaseDate}><span className={styles.infoHeader}>Episodes: </span> {props.episodes}</li>
                    <li className={styles.subgenre}><span className={styles.infoHeader}>Tags: </span>{props.keywords}</li>
                    <li className={styles.director}><span className={styles.infoHeader}>Created by: </span>{props.creator}</li>
                    <li className={styles.synopsis}><span className={styles.infoHeader}>Synopsis: </span> {props.synopsis}</li>
                </ul>
            </div>
        </div>
    );
}