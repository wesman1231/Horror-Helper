import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../UI-Elements/movieCard";
import MovieCard from "../UI-Elements/movieCard";

export default function Director(){

    const { directorName } = useParams();
    const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);

    useEffect(() => {
        async function getDirectorInfo(){

            try{
                const directorRequest = await fetch(`http://localhost:3000/api/directors/${directorName}`);
                const directorResponse: Movie[] = await directorRequest.json();
                setDirectorMovies(directorResponse);

            }catch(error){
                console.error(error);
            }
        }
        getDirectorInfo();
    }, []);

    return(
        <>
            <ul>
               {directorMovies.map((movie) => 
                <MovieCard key={movie.tmdbid} tmdbid={movie.tmdbid} title={movie.title} poster={movie.poster} keywords={movie.keywords} director={movie.director} releasedate={movie.releasedate} franchise={movie?.franchise} synopsis={movie.synopsis} cast={movie.cast} />
            )}
            </ul>
        </>
    );
}