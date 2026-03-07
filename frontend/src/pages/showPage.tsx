import styles from './pages_css/showPage.module.css';
import useReviews from '../hooks/useReviews';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Show } from "../UI-Elements/tvCard";
import MovieShowPageError from "../UI-Elements/movieShowPageError";
import ShowInfo from "../UI-Elements/showInfo";
import CreateReview from "../UI-Elements/createReview";
import PostedreviewsContainer from "../UI-Elements/postedReviewsContainer";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * ShowPage Component
 *
 * Displays detailed information for a single TV show.
 * The show ID is retrieved from the route parameters and used
 * to fetch data from the backend API.
 *
 * Features:
 * - Authentication guard (redirects unauthenticated users)
 * - Error handling for missing or invalid shows
 * - Conditional rendering of show info or error state
 *
 * Route example:
 * `/shows/67890`
 *
 * @component
 * @returns {JSX.Element} TV show detail page UI
 */
export default function ShowPage() {
    const reviewLogic = useReviews();

    // Get authenticated user info and token helper from Auth0
    const { user, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState<string>("");
    
    /**
     * Show ID retrieved from the URL parameters.
     */
    const { id } = useParams();

    /**
     * Fetched show data from the API.
     * `null` indicates data has not been loaded yet.
     */
    const [showData, setShowData] = useState<Show | null>(null);

    /** Error message returned from the server */
    const [errorMessage, setErrorMessage] = useState<string>("");

    /** Indicates whether an error occurred while fetching show data */
    const [errorState, setErrorState] = useState<boolean>(false);


    /**
     * Fetch Show Information
     *
     * Retrieves TV show details from the backend API using the show ID.
     * Handles API-level errors and updates error state accordingly.
     */
    useEffect(() => {
        async function getShowInfo() {
            try {
                const fetchInfo = await fetch(
                    `http://localhost:3000/api/shows/${id}`
                );
                const fetchResults = await fetchInfo.json();

                // If server returns an error response
                if (Object.hasOwn(fetchResults, "error")) {
                    setErrorMessage(fetchResults.error);
                    setErrorState(true);
                }
                // Otherwise, store the show data
                else {
                    setShowData(fetchResults[0]);
                    setErrorState(false);
                }
            } catch (error) {
                console.error("Error fetching show data:", error);
            }
        }

        getShowInfo();
    }, [id]);

    // Fetch the token string on mount/user change
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);
            } catch (e) {
                console.error("Error getting token", e);
            }
        };
        if (user) fetchToken();
    }, [getAccessTokenSilently, user]);

    //Fetch reviews when showData or reviews change
    useEffect(() => {
        reviewLogic.getReviews(showData?.tmdbid, 'movies');
    }, [showData?.tmdbid, reviewLogic.reviews]);

    // Extract user ID from Auth0 user object
    const userID = user?.sub;

    // Extract custom username claim from Auth0 token
    const userName = user?.['https://horror-helper-backend/username'];

    return (
        <div className={styles.showPage}>
            {/* Conditionally render error or show information */}
            {errorState ? (
                <MovieShowPageError errorMessage={errorMessage} />
            ) : (
                <ShowInfo showData={showData} />
            )}
            <CreateReview 
                mediaData={showData} 
                mediaType='shows' 
                token={accessToken} 
                username={userName} 
                userID={userID} 
                postReview={reviewLogic.postReview}
            />
            <PostedreviewsContainer reviews={reviewLogic.reviews}/>
        </div>
    );
}
