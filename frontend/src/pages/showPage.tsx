import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Show }  from '../UI-Elements/tvCard';
import MovieShowPageError from "../UI-Elements/movieShowPageError";
import ShowInfo from '../UI-Elements/showInfo';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useNavigate } from 'react-router';

export default function ShowPage(){
    const { id } = useParams();
    const [showData, setShowData] = useState<Show | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errorState, setErrorState] = useState<boolean>(false);

    //check if user is logged in, if not, redirect them to log in page
    const navigate = useNavigate();    
    const auth = getAuth(app);

    useEffect(() => {
            onAuthStateChanged(auth, (user) => {
            if(!user){
                navigate('/');
            }
        });
        }, []);

    useEffect(() => {
        //fetch movie info to render on the page
        async function getShowInfo(){
            try{
                const fetchInfo = await fetch(`http://localhost:3000/api/shows/${id}`);
                const fetchResults = await fetchInfo.json();
                //if server returns an error response, set error to equal the error string in the response
                if(Object.hasOwn(fetchResults, 'error')){
                    setErrorMessage(fetchResults.error);
                    setErrorState(true);
                }
                //otherwise, set the showData to the fetched json
                else{
                    setShowData(fetchResults[0]);
                    setErrorState(false);
                    console.log(fetchResults[0]);
                }
            }catch(error){
                console.error('Error fetching data: ', error)
            }
        }
        getShowInfo();
    }, [id]);
    
    
    return(
        <>
            {errorState ? <MovieShowPageError errorMessage={errorMessage} /> : <ShowInfo showData={showData} />}
        </>
    );
}