import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../UI-Elements/movieCard";
import MovieCard from "../UI-Elements/movieCard";
import styles from "../pages/pages_css/director.module.css";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useNavigate } from 'react-router';

export default function Director(){
    const { directorName } = useParams();
    const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);
    const [directorImage, setDirectorImage] = useState<string>();
    const [directorBirthday, setDirectorBirthday] = useState<string>();
    const [directorDeathDate, setDirectorDeathDate] = useState<string>();
    const [directorBio, setDirectorBio] = useState<string>();

    const navigate = useNavigate();
    const auth = getAuth(app);

    //check if user is logged in, if they are not, redirect them to log in page
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });
    }, []);

    useEffect(() => {
        async function getDirectorInfo(){
            try{
                const directorRequest = await fetch(`http://localhost:3000/api/directors/${directorName}`);
                const directorResponse = await directorRequest.json();
                setDirectorMovies(directorResponse.movies);
                setDirectorImage(directorResponse.image);
                setDirectorBio(directorResponse.profile.biography);
                setDirectorBirthday(directorResponse.profile.birthday);
                setDirectorDeathDate(directorResponse.profile.deathday);
            }catch(error){
                console.error(error);
            }
        }
        getDirectorInfo();
    }, []);

    return(
        <>
            <h2 className={styles.directorName}>{directorName?.replaceAll('+', ' ')}</h2>
            <div className={styles.directorInfoWrapper}>
                <img src={directorImage} alt={`Image of ${directorName}`}/>
                <p>Birthday: {`${directorBirthday}`}</p>
                <p>Biography:</p>
                <p className={styles.bio}>{`${directorBio}`}</p>
                <p>{directorDeathDate !== null ? `Death date: ${directorDeathDate}`  : null}</p>
            </div>
            <h3 className={styles.filmsHeader}>Films</h3>
            <ul className={styles.movieList}>
               {directorMovies.map((movie) => 
                <MovieCard key={movie.tmdbid} tmdbid={movie.tmdbid} title={movie.title} poster={movie.poster} keywords={movie.keywords} director={movie.director} releasedate={movie.releasedate} franchise={movie?.franchise} synopsis={movie.synopsis} cast={movie.cast} />
            )}
            </ul>
        </>
    );
}