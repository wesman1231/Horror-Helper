import styles from "../UI-Elements/UI_css/noResultsFound.module.css";

/**
 * NoResultsFound Component
 *
 * Displays a message indicating that a search or query returned no results.
 * Typically used on search pages when the results array is empty or undefined.
 *
 * @component
 * @returns {JSX.Element} Styled "No Results Found" message
 */
export default function NoResultsFound() {
    return <h2 className={styles.noResultsFound}>No Results Found</h2>;
}
