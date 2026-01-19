import type { Show } from "./tvCard";
import styles from "../UI-Elements/UI_css/extraShowInfo.module.css";

/**
 * Props for the ExtraShowInfo component.
 */
interface ShowProps {
    /**
     * Show data used to display additional details.
     * `null` indicates the data has not yet loaded.
     */
    showData: Show | null;
}

/**
 * ExtraShowInfo Component
 *
 * Displays supplementary information for a TV show, including:
 * - Tags / keywords
 * - Creator information
 * - Synopsis
 *
 * This component complements the main show details view
 * and focuses on extended descriptive content.
 *
 * @component
 * @param {ShowProps} props - Component props
 * @returns {JSX.Element} Additional show information section
 */
export default function ExtraShowInfo(props: ShowProps) {
    return (
        <section className={styles.showWrapper}>
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>
                {props.showData?.keywords}
            </p>

            <h3 className={styles.creatorHeader}>Created By:</h3>
            <p className={styles.creator}>
                {props.showData?.creator}
            </p>

            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>
                {props.showData?.synopsis}
            </p>
        </section>
    );
}
