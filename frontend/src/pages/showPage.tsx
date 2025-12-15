import styles from '../pages/pages_css/showPage.module.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {Show} from '../UI-Elements/tvCard';

export default function ShowPage(){
    const { id } = useParams();
    const [showData, setShowData] = useState<Show | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        //fetch movie info to render on the page
        async function getShowInfo(){
            try{
                const fetchInfo = await fetch(`http://localhost:3000/api/shows/${id}`);
                const fetchResults = await fetchInfo.json();
                //if server returns an error response, set error to equal the error string in the response
                if(Object.hasOwn(fetchResults, 'error')){
                    setError(fetchResults.error);
                }
                //otherwise, set the showData to the fetched json
                else{
                    setShowData(fetchResults[0]);
                    console.log(fetchResults[0]);
                }
            }catch(error){
                console.error('Error fetching data: ', error)
            }
        }
        getShowInfo();
    }, [id]);
    
    //if there is an error in fetching data, return an error message
    if(error != ''){
        return(
            <div className={styles.errorWrapper}>
                <h2 className={styles.noMovieFound}>Error: {error}</h2>
            </div>
        );
        
    }
    //otherwise, render fetched show data
    return(
        <div className={styles.movieWrapper}>
            <h2 className={styles.movieTitle}>{showData?.title}</h2>
            <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${showData?.poster}`}></img>
            <h3 className={styles.releaseDate}>Premiere Date: {showData?.firstairdate}</h3>
            <h3 className={styles.releaseDate}>Finale Date: {showData?.lastairdate}</h3>
            <h3 className={styles.seasons}>Seasons: {showData?.seasons}</h3>
            <h3 className={styles.episodes}>Episodes: {showData?.episodes}</h3>
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>{showData?.keywords}</p>
            <h3 className={styles.creatorHeader}>Created By:</h3>
            <p className={styles.creator}>{showData?.creator}</p>
            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>{showData?.synopsis}</p>
        </div>
    );
}