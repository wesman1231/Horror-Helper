import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from '../UI-Elements/movieCard';
import MovieInfo from '../UI-Elements/movieInfo';
import MovieShowPageError from "../UI-Elements/movieShowPageError";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useNavigate } from "react-router";

export default function MoviePage(){
    const { id } = useParams();
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [errorState, setErrorState] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const navigate = useNavigate();

    //check if user is logged in, if they are not, redirect them to log in page
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });

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
                }
            }catch(error){
                console.error('Error fetching data: ', error);
            }
        }
        getMovieInfo(); 
    }, [id]);

        return(
            <>
                {errorState ? <MovieShowPageError errorMessage={errorMessage} /> : <MovieInfo movieData={movieData}  />}
            </>
        );
    

    
}