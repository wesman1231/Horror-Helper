import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExtraMovieInfo from "./extraMovieInfo";
import type { Movie } from "../UI-Elements/movieCard";
import styles from "../UI-Elements/UI_css/movieInfo.module.css";
import Review from "./review";
import PostedreviewsContainer from "./postedReviewsContainer";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Props for the MovieInfo component.
 */
interface MovieDataProps {
    /**
     * Movie object containing details to display.
     * `null` indicates the movie data has not yet loaded.
     */
    movieData: Movie | null;
}

/**
 * MovieInfo Component
 *
 * Displays core information about a single movie, including:
 * - Title
 * - Poster image
 * - Release date
 * - Director (link to director page)
 * - Franchise (link if available)
 * - Toggleable extra information (tags, synopsis, cast)
 *
 * Features:
 * - Dropdown to show/hide extended movie details via ExtraMovieInfo
 * - Director and franchise links dynamically formatted for routing
 * - Handles null or missing movie data gracefully
 *
 * @component
 * @param {MovieDataProps} props - Movie data to display
 * @returns {JSX.Element} Movie information section with toggleable extra info
 */


export default function MovieInfo(props: MovieDataProps) {
    const { user, getAccessTokenSilently  } = useAuth0();
    const [infoDropdown, setInfoDropdown] = useState<boolean>(false);

    const userID = user?.sub;
    const userName = user?.['https://horror-helper-backend/username'];

    useEffect(() => {
        async function getToken(){
            await getAccessTokenSilently();
        }
        getToken();
    }, []);

    // Format director and franchise names for URLs
    const formatDirector = props.movieData?.director?.replaceAll(" ", "+");
    const formatFranchise = props.movieData?.franchise?.replaceAll(" ", "+");

    /**
     * Toggles the visibility of the extra movie information section.
     */
    function toggleInfo() {
        setInfoDropdown(!infoDropdown);
    }

    return (
        <section className={styles.movieWrapper}>
            <h2 className={styles.movieTitle}>{props.movieData?.title}</h2>

            <img
                src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.movieData?.poster}`}
                alt={`Poster for ${props.movieData?.title}`}
            />

            <h3 className={styles.releaseDate}>
                Release Date: {props.movieData?.releasedate}
            </h3>

            <h3 className={styles.director}>
                Director:{" "}
                <Link to={`/directors/${formatDirector}`}>
                    {props.movieData?.director}
                </Link>
            </h3>

            {props.movieData?.franchise === null ? (
                <h3 className={styles.franchise}>Franchise: none</h3>
            ) : (
                <h3 className={styles.franchise}>
                    Franchise:{" "}
                    <Link to={`/franchises/${formatFranchise}`}>
                        {props.movieData?.franchise}
                    </Link>
                </h3>
            )}

            <button className={styles.dropdown} onClick={toggleInfo}>
                Show More {infoDropdown ? String.fromCodePoint(128315) : String.fromCodePoint(128314)}
            </button>

            {infoDropdown ? <ExtraMovieInfo movieData={props.movieData} /> : null}
            <Review username={userName} userID={userID} mediaID={props.movieData?.tmdbid} mediaType='movies'/>
            <PostedreviewsContainer username={userName} userID={userID} mediaType='movies' mediaID={props.movieData?.tmdbid} />
        </section>
    );
}
