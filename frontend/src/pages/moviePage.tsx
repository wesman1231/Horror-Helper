import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from '../UI-Elements/movieCard';
import MovieInfo from '../UI-Elements/movieInfo';
import MoviePageError from "../UI-Elements/moviePageError";

export default function MoviePage(){
    const { id } = useParams();
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [errorState, setErrorState] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [franchiseNull, setFranchiseNull] = useState(false);
    
    

    useEffect(() => {
        //fetch movie info to render on the page
        async function getMovieInfo(){
            try{
                const fetchInfo = await fetch(`http://localhost:3000/api/movies/${id}`);
                const fetchResults = await fetchInfo.json();
                //if server returns an error response, set error to equal the error string in the response
                if(Object.hasOwn(fetchResults, 'error')){
                    setErrorState(true);
                    setErrorMessage(fetchResults.error);
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
                console.error('Error fetching data: ', error);
            }
        }
        getMovieInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

        return(
            <>
                {errorState ? <MoviePageError errorMessage={errorMessage} /> : <MovieInfo movieData={movieData} franchiseNull={franchiseNull} />}
            </>
        );
    

    
}