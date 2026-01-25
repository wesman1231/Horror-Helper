import styles from '../pages/pages_css/newReleases.module.css'
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Movie } from '../UI-Elements/movieCard';

export default function NewReleases(){
    const currentDate: Date = new Date();    
    const navigate = useNavigate();
    const auth = getAuth(app);

    //check if user is logged in, if not, redirect them to log in page
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });
    }, []);

    const [movies, setMovies] = useState<Movie[] | null>([]);

    async function getNewMovies(){
        const fetchNewMovies = await fetch('http://localhost:3000/api/movies/new-releases');
        const movieResults: Movie[] = await fetchNewMovies.json();
        setMovies(movieResults);
    }

    async function getNewShows(){

    }

    //fetch all movies and shows with current year release date
    useEffect(() => {
        
    }, []);

    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
            <nav className={styles.contentNav}>
                <button onClick={() => getNewMovies}>Movies</button>
                <button onClick={() => getNewShows}>Shows</button>
            </nav>
        </>
    )
}