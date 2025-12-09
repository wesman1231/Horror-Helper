import styles from './moviePage.module.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {Movie} from '../UI-Elements/movieCard';

export default function MoviePage(){
    const { id } = useParams();
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [error, setError] = useState<string>('');
    const [franchiseNull, setFranchiseNull] = useState(false);
    const [infoDropdown, setInfoDropdown] = useState<boolean>(false);
    const [reviewValue, setReviewValue] = useState<string>('');

    useEffect(() => {
        //fetch movie info to render on the page
        async function getMovieInfo(){
            try{
                const fetchInfo = await fetch(`http://localhost:3000/api/movies/${id}`);
                const fetchResults = await fetchInfo.json();
                //if server returns an error response, set error to equal the error string in the response
                if(Object.hasOwn(fetchResults, 'error')){
                    setError(fetchResults.error);
                }
                //otherwise, set the movieData to the fetched json
                else{
                    setMovieData(fetchResults[0]);
                    console.log(fetchResults[0]);
                    if(movieData?.franchise === null){
                        setFranchiseNull(true);
                    }
                }
            }catch(error){
                console.error('Error fetching data: ', error)
            }
        }
        getMovieInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    
    function toggleInfo(){
        if(infoDropdown === false){
            setInfoDropdown(true);
        }
        else{
            setInfoDropdown(false);
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>){
        setReviewValue(event.target.value);
    }

    //if there is an error in fetching data, return an error message
    if(error != ''){
        return(
            <div className={styles.errorWrapper}>
                <h2 className={styles.noMovieFound}>Error: {error}</h2>
            </div>
        );
        
    }

    if(infoDropdown === true){
        return(
            <div className={styles.movieWrapper}>
                <h2 className={styles.movieTitle}>{movieData?.title}</h2>
                <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movieData?.poster}`}></img>
                <h3 className={styles.releaseDate}>Release Date: {movieData?.releasedate}</h3>
                <h3 className={styles.director}>Director: {movieData?.director}</h3>
                {franchiseNull ? <h3 className={styles.franchise}>Franchise: none</h3> : (<h3 className={styles.franchise}>Franchise: {movieData?.franchise}</h3>)}
                <button className={styles.dropdown} onClick={toggleInfo} >Show Less {String.fromCodePoint(128315)}</button>
                <h3 className={styles.tagsHeader}>Tags:</h3>
                <p className={styles.tags}>{movieData?.keywords}</p>
                <h3 className={styles.synopsisHeader}>Synopsis:</h3>
                <p className={styles.synopsis}>{movieData?.synopsis}</p>
                <h3 className={styles.castHeader}>Cast: </h3>
                <p className={styles.castText}>{movieData?.cast}</p>
                <textarea name='review' id='review' rows={10} cols={50} className={styles.reviewInput} value={reviewValue} onChange={handleInput} ></textarea>
            </div>
        );
    }

    else{
        //otherwise, render fetched movie data
        return(
            <div className={styles.movieWrapper}>
                <h2 className={styles.movieTitle}>{movieData?.title}</h2>
                <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${movieData?.poster}`}></img>
                <h3 className={styles.releaseDate}>Release Date: {movieData?.releasedate}</h3>
                <h3 className={styles.director}>Director: {movieData?.director}</h3>
                {franchiseNull ? <h3 className={styles.franchise}>Franchise: none</h3> : (<h3 className={styles.franchise}>Franchise: {movieData?.franchise}</h3>)}
                <button className={styles.dropdown} onClick={toggleInfo} >Show More {String.fromCodePoint(128314)}</button>
                <textarea name='review' id='review' rows={10} cols={50} className={styles.reviewInput} value={reviewValue} onChange={handleInput} ></textarea>
            </div>
        );
    }

    
}