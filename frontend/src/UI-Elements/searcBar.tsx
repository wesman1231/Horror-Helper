import { useState } from "react";
import styles from "../UI-Elements/UI_css/searchBar.module.css";
import AddKeywords from "../UI-Elements/addKeyWords";
import type { useSearch } from "../hooks/useSearch";

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
    /** The custom search hook providing state and functions for search functionality */
    searchHook: useSearch;
}

/**
 * SearchBar Component
 *
 * Renders a search input field with optional keyword filters.
 * Features:
 * - Input for searching by title
 * - Search button triggers the searchHook's search function
 * - Toggleable "Add Keywords" section for filtering results
 * - Emoji used as a toggle button for showing/hiding keyword options
 *
 * @component
 * @param {SearchBarProps} props - Props containing the search hook
 * @returns {JSX.Element} Search bar UI with optional keyword filter section
 */
export default function SearchBar(props: SearchBarProps) {
    const [keywordsOpen, setKeywordsOpen] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(true);

    /**
     * Toggles the visibility of the AddKeywords component
     */
    function toggleKeyWords() {
        setKeywordsOpen((prev) => !prev);
        setHidden(false);
    }

    return (
        <div className={styles.searchBarContainer}>
            <input
                type="text"
                id="search-bar"
                className={styles.searchBar}
                value={props.searchHook.searchValue}
                onChange={props.searchHook.handleInput}
                placeholder="Search by title"
            />

            <div className={styles.buttonsWrapper}>
                <button
                    type="button"
                    className={styles.searchButton}
                    onClick={props.searchHook.search}
                >
                    Search
                </button>

                <button
                    type="button"
                    className={styles.addKeywords}
                    onClick={toggleKeyWords}
                >
                    {keywordsOpen
                        ? String.fromCodePoint(128315)
                        : String.fromCodePoint(128314)}
                </button>
            </div>
                {hidden ? null : <AddKeywords keywordsOpen={keywordsOpen} handleCheckboxChange={props.searchHook.handleCheckboxChange} onAnimationEnd={() => {if (!keywordsOpen) setHidden(true);}} />}
        </div>
    );
}
