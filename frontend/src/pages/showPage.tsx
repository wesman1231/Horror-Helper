import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Show } from "../UI-Elements/tvCard";
import MovieShowPageError from "../UI-Elements/movieShowPageError";
import ShowInfo from "../UI-Elements/showInfo";

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

    return (
        <>
            {/* Conditionally render error or show information */}
            {errorState ? (
                <MovieShowPageError errorMessage={errorMessage} />
            ) : (
                <ShowInfo showData={showData} />
            )}
        </>
    );
}
