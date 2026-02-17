import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../UI-Elements/movieCard";
import MovieCard from "../UI-Elements/movieCard";
import styles from "../pages/pages_css/director.module.css";
/**
 * Director Component
 *
 * Displays detailed information about a movie director, including:
 * - Profile image
 * - Biography
 * - Birth and death dates
 * - List of films directed by the person
 *
 * The director's name is read from the URL parameters and used to fetch
 * data from the backend API.
 *
 * Access to this page is restricted to authenticated users only.
 * Unauthenticated users are redirected to the home page.
 *
 * Route example:
 * `/directors/Quentin+Tarantino`
 *
 * @component
 * @returns {JSX.Element} Director page UI
 */
export default function Director() {
    /**
     * Director name pulled from the route parameters.
     * Expected format uses "+" instead of spaces.
     */
    const { directorName } = useParams();

    /** List of movies directed by this director */
    const [directorMovies, setDirectorMovies] = useState<Movie[]>([]);

    /** Director profile image URL */
    const [directorImage, setDirectorImage] = useState<string>();

    /** Director date of birth */
    const [directorBirthday, setDirectorBirthday] = useState<string>();

    /** Director date of death (if applicable) */
    const [directorDeathDate, setDirectorDeathDate] = useState<string>();

    /** Director biography text */
    const [directorBio, setDirectorBio] = useState<string>();

    /**
     * Fetch Director Information
     *
     * Retrieves director details and filmography from the backend API
     * using the director name from the URL.
     */
    useEffect(() => {
        async function getDirectorInfo() {
            try {
                const directorRequest = await fetch(
                    `http://localhost:3000/api/directors/${directorName}`
                );
                const directorResponse = await directorRequest.json();

                setDirectorMovies(directorResponse.movies);
                setDirectorImage(directorResponse.image);
                setDirectorBio(directorResponse.profile.biography);
                setDirectorBirthday(directorResponse.profile.birthday);
                setDirectorDeathDate(directorResponse.profile.deathday);
            } catch (error) {
                console.error("Failed to fetch director info:", error);
            }
        }

        getDirectorInfo();
    }, []);

    return (
        <>
            {/* Director Name */}
            <h2 className={styles.directorName}>
                {directorName?.replaceAll("+", " ")}
            </h2>

            {/* Director Profile Section */}
            <div className={styles.directorInfoWrapper}>
                <img
                    src={directorImage}
                    alt={`Image of ${directorName}`}
                />
                <p>Birthday: {directorBirthday}</p>

                <p>Biography:</p>
                <p className={styles.bio}>{directorBio}</p>

                {directorDeathDate !== null && (
                    <p>Death date: {directorDeathDate}</p>
                )}
            </div>

            {/* Filmography */}
            <h3 className={styles.filmsHeader}>Films</h3>
            <ul className={styles.movieList}>
                {directorMovies.map((movie) => (
                    <MovieCard
                        key={movie.tmdbid}
                        tmdbid={movie.tmdbid}
                        title={movie.title}
                        poster={movie.poster}
                        keywords={movie.keywords}
                        director={movie.director}
                        releasedate={movie.releasedate}
                        franchise={movie.franchise === null ? 'none' : movie.franchise}
                        synopsis={movie.synopsis}
                        cast={movie.cast}
                    />
                ))}
            </ul>
        </>
    );
}
