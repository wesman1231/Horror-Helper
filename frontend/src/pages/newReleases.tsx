import styles from '../pages/pages_css/newReleases.module.css'
import { useState } from 'react';
import type { Movie } from '../UI-Elements/movieCard';
import type { Show } from '../UI-Elements/tvCard';
import type { mediaType } from './mediaSearch';
import CardList from '../UI-Elements/cardList';

export default function NewReleases(){
    
    /** * Type definition for the expected API payload.
     * The 'error' field is optional, usually populated when the server returns 4xx/5xx.
     */
    interface NewReleasesResponse {
        newReleases: Movie[] | Show[];
        numberOfPages: number;
        error?: string;
    }
    
    const currentDate: Date = new Date();    

    // --- State Management ---
    // Holds the accumulated list of movies or shows
    const [results, setResults] = useState<Movie[] | Show[]>([]);
    // Tracks current view (movies vs shows) to handle UI toggles and API routing
    const [mediaDisplayed, setMediaDisplayed] = useState<mediaType>('movies');
    // Current page index for pagination (0-indexed)
    const [page, setPage] = useState<number>(0);
    // Total pages available from the backend to determine if 'Load More' should show
    const [numOfPages, setNumOfPages] = useState<number>(0);
    // Stores human-readable error messages for UI display
    const [errorMessage, setErrorMessage] = useState<string>();
    // Boolean flag to distinguish between a "no results" state and a "failed fetch" state
    const [fetchOK, setFetchOK] = useState<boolean>();


    /**
     * Core data fetching function.
     * @param page - The specific page number to request
     * @param mediaType - Whether to fetch 'movies' or 'shows'
     */
    async function getNewMedia(page: number, mediaType: mediaType){
       try {
            setMediaDisplayed(mediaType);
            
            // Note: fetch() only throws an error on network failure, not 4xx/5xx responses
            const fetchNewMedia = await fetch(`http://localhost:3000/api/${mediaType}/new-releases?page=${page}`);
            const fetchResults: NewReleasesResponse = await fetchNewMedia.json();
            
            if (fetchNewMedia.ok) {
                setFetchOK(true);
                setNumOfPages(fetchResults.numberOfPages);

                // Update results using functional state update to prevent stale data issues
                setResults((prev) => {
                    // If page is 0, we are switching categories or refreshing, so we replace the list.
                    // Otherwise, we append the new data to the existing array.
                    const combined = page === 0 
                        ? fetchResults.newReleases 
                        : [...prev, ...fetchResults.newReleases];
    
                    return combined as Movie[] & Show[]; 
                });
            }
            // Manual handling for server-side errors (e.g., 500 Internal Server Error)
            else if (!fetchNewMedia.ok) {
                setFetchOK(false);
                setErrorMessage(fetchResults.error);
                // Note: console.log(errorMessage) here will show the OLD value because state updates are async
            }
       }
       catch (error) {
            // Catches network interruptions or JSON parsing failures
            setFetchOK(false);
            setErrorMessage(String(error));
       }
    }
    
    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
            
            {/* Category Navigation */}
            <nav className={styles.contentNav}>
                <button onClick={() => getNewMedia(0, 'movies')}>Movies</button>
                <button onClick={() => getNewMedia(0, 'shows')}>Shows</button>
            </nav>

            <div className={styles.contentContainer}>
            {/* Dynamic Card Rendering based on current media selection */}
            {mediaDisplayed === "movies" ? (
                <CardList mediaType="movies" results={results as Movie[]} />
            ) : (
                <CardList mediaType="shows" results={results as Show[]} />
            )}

            {/* Pagination Trigger: 
                Only visible if the fetch was successful, data exists, and we aren't on the last page.
            */}
            {fetchOK === true && results.length > 0 && page + 1 < numOfPages ? (
                <button 
                    className={styles.loadMoreButton} 
                    type='button' 
                    onClick={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        getNewMedia(nextPage, mediaDisplayed);
                    }}
                >
                    Load more
                </button>
            ) : null}

            {/* Empty State: Shown when a successful fetch returns no data */}
            {results.length === 0 && fetchOK === true ?
                <span className={styles.noResults}>No results found</span>
            : null}
            
            {/* Error State: Shown when the API returns an error or the network fails */}
            {fetchOK === false && errorMessage !== undefined ?
                <span className={styles.errorMessage}>{errorMessage}</span>
            : null}
            </div>
        </>
    )
}