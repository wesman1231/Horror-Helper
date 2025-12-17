import { useState } from "react";
import { Link } from 'react-router-dom';
import ExtraMovieInfo from "./extraMovieInfo";
import type { Movie } from '../UI-Elements/movieCard';
import styles from '../UI-Elements/UI_css/movieInfo.module.css';


interface movieData{
    movieData: Movie | null;
    
}

export default function MovieInfo(props: movieData){

    const [infoDropdown, setInfoDropdown] = useState<boolean>(false);
    const formatDirector = props.movieData?.director?.replaceAll(' ', '+');
    const formatFranchise = props.movieData?.franchise?.replaceAll(' ', '+');

    function toggleInfo(){
        if(infoDropdown === false){
            setInfoDropdown(true);
        }
        else{
            setInfoDropdown(false);
        }
    }

    return(
        <section className={styles.movieWrapper}>
            <h2 className={styles.movieTitle}>{props.movieData?.title}</h2>
            <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.movieData?.poster}`}></img>
            <h3 className={styles.releaseDate}>Release Date: {props.movieData?.releasedate}</h3>
            <h3 className={styles.director}>Director: <Link to={`http://localhost:5173/directors/${formatDirector}`}>{props.movieData?.director}</Link></h3>
            {props.movieData?.franchise === null ? <h3 className={styles.franchise}>Franchise: none</h3> : (<h3 className={styles.franchise}>Franchise: <Link to={`/franchises/${formatFranchise}`}>{props.movieData?.franchise}</Link></h3>)}
            <button className={styles.dropdown} onClick={toggleInfo} >Show More {infoDropdown ? String.fromCodePoint(128315) : String.fromCodePoint(128314)}</button>
            {infoDropdown ? <ExtraMovieInfo movieData={props.movieData} /> : null}
        </section>
    );
}