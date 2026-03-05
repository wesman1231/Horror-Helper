import styles from './pages_css/moviePage.module.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../UI-Elements/movieCard";
import MovieInfo from "../UI-Elements/movieInfo";
import MovieShowPageError from "../UI-Elements/movieShowPageError";
import CreateReview from "../UI-Elements/createReview";
import useReviews from "../hooks/useReviews";
// Auth0 hook for authentication & token access
import { useAuth0 } from "@auth0/auth0-react";
import PostedreviewsContainer from "../UI-Elements/postedReviewsContainer";

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
    const reviewLogic = useReviews();
    
    // Get authenticated user info and token helper from Auth0
    const { user, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState<string>("");
    
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


    // Fetch the token string on mount/user change
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);
                console.log(token);
            } catch (e) {
                console.error("Error getting token", e);
            }
        };
        if (user) fetchToken();
    }, [getAccessTokenSilently, user]);


    // Extract user ID from Auth0 user object
    const userID = user?.sub;

    // Extract custom username claim from Auth0 token
    const userName = user?.['https://horror-helper-backend/username'];

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

    useEffect(() => {
        reviewLogic.getReviews(movieData?.tmdbid, 'movies');
    }, [movieData?.tmdbid, reviewLogic.reviews]);

    return (
        <div className={styles.moviePage}>
            {/* Conditionally render error or movie information */}
            {errorState ? (
                <MovieShowPageError errorMessage={errorMessage} />
            ) : (
                <MovieInfo movieData={movieData} />
            )}
            <CreateReview 
                mediaData={movieData} 
                mediaType='movies' 
                token={accessToken} 
                username={userName} 
                userID={userID} 
                postReview={reviewLogic.postReview}
            />
            <PostedreviewsContainer reviews={reviewLogic.reviews}/>
        </div>
    );
}
