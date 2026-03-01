import styles from '../pages/pages_css/newReleases.module.css'
import { useEffect, useState } from 'react';
import type { Movie } from '../UI-Elements/movieCard';
import type { Show } from '../UI-Elements/tvCard';
import type { mediaType } from './mediaSearch';
import CardList from '../UI-Elements/cardList';
import LoadMoreButton from '../UI-Elements/loadMoreButton';
import { EmptyState, ErrorState } from '../UI-Elements/emptyOrError';
import ScrollToTopButton from '../UI-Elements/backToTopButton';

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
    const [results, setResults] = useState<Movie[] | Show[]>([]);
    const [mediaDisplayed, setMediaDisplayed] = useState<mediaType>('movies');
    const [page, setPage] = useState<number>(0);
    const [numOfPages, setNumOfPages] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [fetchOK, setFetchOK] = useState<boolean>(false);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [toTopButtonVisible, setToTopButtonVisible] = useState<boolean>(false);
    
    /**
     * Effect: Scroll Listener
     * Attaches a global scroll listener to sync the window's vertical scroll 
     * position with the component state.
     */
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup: Remove event listener on unmount to prevent memory leaks
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); 

    /**
     * Effect: Scroll-to-Top Visibility Logic
     * Runs whenever 'scrollPosition' updates. Logic is separated from the scroll listener
     * to keep calculations clean and avoid unnecessary logic inside the high-frequency scroll event.
     */
    useEffect(() => {
        function toggleToTopButton(){
            // Show button only after scrolling down twice the height of the user's viewport
            const triggerPosition = window.innerHeight * 2;

            if(scrollPosition >= triggerPosition){
                setToTopButtonVisible(true);
            }
            else{
                setToTopButtonVisible(false);
            }
        }

        toggleToTopButton();
    }, [scrollPosition]);


    /**
     * Core data fetching function.
     * Handles API communication, state merging for pagination, and error boundary logic.
     * * @param page - The specific page number to request
     * @param mediaType - Whether to fetch 'movies' or 'shows'
     */
    async function getNewMedia(page: number, mediaType: mediaType){
       try {
            setMediaDisplayed(mediaType);
            
            const fetchNewMedia = await fetch(`http://localhost:3000/api/${mediaType}/new-releases?page=${page}`);
            const fetchResults: NewReleasesResponse = await fetchNewMedia.json();
            
            if (fetchNewMedia.ok) {
                // Reset error states upon a successful fetch
                setFetchOK(true);
                setErrorMessage(undefined); 
                setNumOfPages(fetchResults.numberOfPages);

                setResults((prev) => {
                    /**
                     * Pagination Logic:
                     * If page is 0, we assume a fresh category selection or refresh, 
                     * so we clear the previous state.
                     * Otherwise, we spread the previous results and append new ones.
                     */
                    const combined = page === 0 
                        ? fetchResults.newReleases 
                        : [...prev, ...fetchResults.newReleases];
    
                    // Type assertion required because the API returns a union, 
                    // and we ensure the UI components receive the correct array structure.
                    return combined as Movie[] & Show[]; 
                });
            }
            // Handling specialized API errors (e.g. rate limits, 404s)
            else if (!fetchNewMedia.ok) {
                setFetchOK(false);
                setErrorMessage(fetchResults.error || "An unexpected error occurred.");
            }
       }
       catch (error) {
            // Catches network interruptions (offline) or JSON parsing failures
            setFetchOK(false);
            setErrorMessage(String(error));
       }
    }
    
    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
            
            {/* * Navigation:
              * Resets pagination to 0 when switching media types to ensure 
              * the user starts from the beginning of the new category.
            */}
            <nav className={styles.contentNav}>
                <button onClick={() => { setPage(0); getNewMedia(0, 'movies'); }}>Movies</button>
                <button onClick={() => { setPage(0); getNewMedia(0, 'shows'); }}>Shows</button>
            </nav>

            <div className={styles.contentContainer}>
            {/* * Type-Safe Rendering:
              * Using a ternary to ensure 'results' is cast to the specific type 
              * required by the CardList component. 
            */}
            {mediaDisplayed === "movies" ? (
                <CardList mediaType="movies" results={results as Movie[]} />
            ) : (
                <CardList mediaType="shows" results={results as Show[]} />
            )}

                {/* * Pagination Control:
                  * Only visible if the fetch was successful, data exists, and 
                  * we haven't reached the last available page.
                */}
                <LoadMoreButton 
                    isVisible={fetchOK && results.length > 0 && page + 1 < numOfPages}
                    onLoadMore={() => {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        getNewMedia(nextPage, mediaDisplayed);
                    }}
                />

                {/* Conditional UI States: Empty results or API Error messages */}
                <EmptyState show={results.length === 0 && fetchOK} />
                <ErrorState isError={fetchOK === false} message={errorMessage} />

                {/* Fixed position floating button to return to top of view */}
                <ScrollToTopButton isVisible={toTopButtonVisible} />
            </div>
        </>
    )
}