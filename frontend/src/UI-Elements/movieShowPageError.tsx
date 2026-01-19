import styles from "../UI-Elements/UI_css/moviePageError.module.css";

/**
 * Props for the MovieShowPageError component.
 */
interface ErrorMessageProps {
    /**
     * Error message string to display on the page.
     */
    errorMessage: string;
}

/**
 * MovieShowPageError Component
 *
 * Displays an error message for movie or show pages.
 * Typically used when fetching data fails or the item is not found.
 *
 * @component
 * @param {ErrorMessageProps} props - Error message to display
 * @returns {JSX.Element} Styled error message
 */
export default function MovieShowPageError(props: ErrorMessageProps) {
    return <h2 className={styles.error}>{props.errorMessage}</h2>;
}
