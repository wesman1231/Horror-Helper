import { useState, useEffect } from "react";
import type { Show } from "./tvCard";
import styles from "../UI-Elements/UI_css/showInfo.module.css";
import ExtraShowInfo from "./extraShowInfo";
import useGetReviews from '../hooks/useGetReviews';
import Review from "./createReview";
import PostedreviewsContainer from "./postedReviewsContainer";

/**
 * Props for the ShowInfo component.
 */
interface ShowProps {
    /** Show data to display */
    showData: Show | null;
}

/**
 * ShowInfo Component
 *
 * Renders detailed information about a TV show.
 * Features:
 * - Displays poster, title, premiere/finale dates, seasons, and episodes
 * - Includes a toggleable "Show More" section with additional info via ExtraShowInfo
 * - Uses emoji button to indicate dropdown state
 *
 * @component
 * @param {ShowProps} props - Props containing show data
 * @returns {JSX.Element} TV show information section
 */
export default function ShowInfo(props: ShowProps) {
    const fetchReviews = useGetReviews();
    const [infoDropdown, setInfoDropdown] = useState<boolean>(false);

    //Fetch show reviews
    useEffect(() => {
            fetchReviews.getReviews(props.showData?.tmdbid, 'shows');
        }, [props.showData?.tmdbid]);

    /**
     * Toggles the visibility of the ExtraShowInfo component
     */
    function toggleInfo() {
        setInfoDropdown((prev) => !prev);
    }

    return (
        <section className={styles.showWrapper}>
            <h2 className={styles.showTitle}>{props.showData?.title}</h2>
            <img
                src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.showData?.poster}`}
                alt={`Poster for ${props.showData?.title}`}
            />
            <h3 className={styles.releaseDate}>
                Premiere Date: {props.showData?.firstairdate}
            </h3>
            <h3 className={styles.releaseDate}>
                Finale Date: {props.showData?.lastairdate}
            </h3>
            <h3 className={styles.seasons}>Seasons: {props.showData?.seasons}</h3>
            <h3 className={styles.episodes}>Episodes: {props.showData?.episodes}</h3>

            <button className={styles.dropdown} onClick={toggleInfo}>
                Show More {infoDropdown ? String.fromCodePoint(128315) : String.fromCodePoint(128314)}
            </button>

            {infoDropdown && <ExtraShowInfo showData={props.showData} />}
            <Review mediaID={props.showData?.tmdbid} mediaType='shows' fetchReviews={fetchReviews}/>
            <PostedreviewsContainer reviews={fetchReviews.reviews}/>
        </section>
    );
}
