import { useState } from "react";
import styles from "../UI-Elements/UI_css/sortMenu.module.css";
import type { sortModes } from "../hooks/useSearch";

/**
 * Props for the SortMenu component.
 */
interface SortProps {
    /** The type of media being sorted: 'movies' or 'shows' */
    mediaType: string | undefined;
    /** Current sorting mode */
    sortMode: sortModes;
    /** Sorting callback functions */
    relevanceSort: () => void;
    titleSort: () => void;
    oldestSort: () => void;
    newestSort: () => void;
    directorSort: () => void;
    franchiseSort: () => void;
    firstAiredSort: () => void;
    lastAiredSort: () => void;
    creatorSort: () => void;
}

/**
 * SortMenu Component
 *
 * Renders a dropdown menu for sorting movies or TV shows.
 * - Dynamically displays different sorting options depending on the media type
 * - Highlights the currently active sort mode
 * - Toggleable dropdown for better UX
 *
 * @component
 * @param {SortProps} props - Props containing media type, current sort mode, and sorting functions
 * @returns {JSX.Element} Dropdown menu with sort options
 */
export default function SortMenu(props: SortProps) {
    const [sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false);

    /**
     * Toggles the visibility of the sort options dropdown
     */
    function toggleSortOptions() {
        setSortOptionsToggle((prev) => !prev);
    }

    const movieSortButtons = (
        <ul className={styles.sortOptions}>
            <button onClick={props.relevanceSort} style={{ textShadow: props.sortMode === "relevance" ? "2px 1px red" : "none" }}>Relevance</button>
            <button onClick={props.oldestSort} style={{ textShadow: props.sortMode === "releasedate" ? "2px 1px red" : "none" }}>Oldest</button>
            <button onClick={props.newestSort} style={{ textShadow: props.sortMode === "newest" ? "2px 1px red" : "none" }}>Newest</button>
            <button onClick={props.titleSort} style={{ textShadow: props.sortMode === "title" ? "2px 1px red" : "none" }}>Title</button>
            <button onClick={props.directorSort} style={{ textShadow: props.sortMode === "director" ? "2px 1px red" : "none" }}>Director</button>
            <button onClick={props.franchiseSort} style={{ textShadow: props.sortMode === "franchise" ? "2px 1px red" : "none" }}>Franchise</button>
        </ul>
    );

    const showSortButtons = (
        <ul className={styles.sortOptions}>
            <button onClick={props.relevanceSort} style={{ textShadow: props.sortMode === "relevance" ? "2px 1px red" : "none" }}>Relevance</button>
            <button onClick={props.firstAiredSort} style={{ textShadow: props.sortMode === "firstairdate" ? "2px 1px red" : "none" }}>First Aired</button>
            <button onClick={props.lastAiredSort} style={{ textShadow: props.sortMode === "lastairdate" ? "2px 1px red" : "none" }}>Last Aired</button>
            <button onClick={props.titleSort} style={{ textShadow: props.sortMode === "title" ? "2px 1px red" : "none" }}>Title</button>
            <button onClick={props.creatorSort} style={{ textShadow: props.sortMode === "creator" ? "2px 1px red" : "none" }}>Creator</button>
        </ul>
    );

    return (
        <div className={styles.dropdown}>
            {sortOptionsToggle ? (
                <>
                    <button className={styles.sortBy} onClick={toggleSortOptions}>
                        Sort by {String.fromCodePoint(128315)}
                    </button>
                    {props.mediaType === "movies" ? movieSortButtons : showSortButtons}
                </>
            ) : (
                <button className={styles.sortBy} onClick={toggleSortOptions}>
                    Sort by {String.fromCodePoint(128314)}
                </button>
            )}
        </div>
    );
}
