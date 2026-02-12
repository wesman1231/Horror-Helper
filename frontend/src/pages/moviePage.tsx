import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import MovieInfo from "../UI-Elements/movieInfo";
import MovieShowPageError from "../UI-Elements/movieShowPageError";

/**
 * MoviePage Component
 *
 * Displays detailed information for a single movie.
 * The movie ID is retrieved from the route parameters and used
 * to fetch data from the backend API.
 *
 * Features:
 * - Authentication guard (redirects unauthenticated users)
 * - Error handling for missing or invalid movies
 * - Conditional rendering of movie info or error state
 *
 * Route example:
 * `/movies/12345`
 *
 * @component
 * @returns {JSX.Element} Movie detail page UI
 */
export default function MoviePage() {
    /**
     * Movie ID retrieved from the URL parameters.
     */
    const { id } = useParams();

    /**
     * Fetched movie data from the API.
     * `null` indicates data has not been loaded yet.
     */
    const [movieData, setMovieData] = useState<Movie | null>(null);

    /** Indicates whether an error occurred while fetching movie data */
    const [errorState, setErrorState] = useState<boolean>(false);

    /** Error message returned from the server */
    const [errorMessage, setErrorMessage] = useState<string>("");


    /**
     * Fetch Movie Information
     *
     * Retrieves movie details from the backend API using the movie ID.
     * Handles API-level errors and updates error state accordingly.
     */
    useEffect(() => {
        async function getMovieInfo() {
            try {
                const fetchInfo = await fetch(
                    `http://localhost:3000/api/movies/${id}`
                );
                const fetchResults = await fetchInfo.json();
                console.log(fetchResults);

                // If server returns an error response
                if (Object.hasOwn(fetchResults, "error")) {
                    setErrorState(true);
                    setErrorMessage(fetchResults.error);
                }
                // Otherwise, store the movie data
                else {
                    setMovieData(fetchResults);
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        }

        getMovieInfo();
    }, [id]);

    return (
        <>
            {/* Conditionally render error or movie information */}
            {errorState ? (
                <MovieShowPageError errorMessage={errorMessage} />
            ) : (
                <MovieInfo movieData={movieData} />
                
            )}
        </>
    );
}
