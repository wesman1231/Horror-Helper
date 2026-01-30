import useSearch from "../hooks/useSearch";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";
import { useParams } from "react-router";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";


/**
 * Supported media types for the search page.
 */
export type mediaType = "movies" | "shows";

/**
 * MediaSearch Component
 *
 * Provides a searchable, sortable, and paginated list of movies or TV shows.
 * The media type (movies or shows) is determined by the route parameter.
 *
 * Features:
 * - Search input with persistent search state
 * - Sorting options based on media type
 * - Pagination support
 * - Authentication guard (redirects unauthenticated users)
 *
 * Route examples:
 * `/search/movies`
 * `/search/shows`
 *
 * @component
 * @returns {JSX.Element} Media search page UI
 */
export default function MediaSearch() {
    
    /**
     * Media type read from the URL parameters.
     * Determines whether movies or TV shows are displayed.
     */
    const { mediaType } = useParams<{ mediaType: mediaType }>();

    /**
     * Custom search hook that manages:
     * - Query state
     * - Sorting mode
     * - Pagination
     * - Displayed results
     */
    const searchHook = useSearch();
    /**
     * Guard clause for invalid or missing media types.
     */
    if (!mediaType) {
        return <div>Invalid media type</div>;
    }

    return (
        <>
            {/* Search input field */}
            <SearchBar searchHook={searchHook} />

            {/* Sort menu (conditionally rendered) */}
            {searchHook.sortMenuVisible ? (
                <SortMenu
                    mediaType={mediaType}
                    sortMode={searchHook.sortMode}
                    relevanceSort={searchHook.relevanceSort}
                    titleSort={searchHook.titleSort}
                    oldestSort={searchHook.oldestSort}
                    newestSort={searchHook.newestSort}
                    directorSort={searchHook.directorSort}
                    franchiseSort={searchHook.franchiseSort}
                    firstAiredSort={searchHook.firstAiredSort}
                    lastAiredSort={searchHook.lastAiredSort}
                    creatorSort={searchHook.creatorSort}
                />
            ) : null}

            {/* No results state */}
            {searchHook.pages === undefined ? <NoResultsFound /> : null}

            {/* Search results */}
            {mediaType === "movies" ? (
                <CardList
                    mediaType="movies"
                    results={searchHook.displayedResults as Movie[]}
                />
            ) : (
                <CardList
                    mediaType="shows"
                    results={searchHook.displayedResults as Show[]}
                />
            )}

            {/* Pagination controls */}
            <PageButtons
                pages={searchHook.pages}
                changePage={searchHook.changePage}
                previousSearch={searchHook.previousSearch}
                sortMode={searchHook.sortMode}
            />
        </>
    );
}
