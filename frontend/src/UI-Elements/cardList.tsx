import { Suspense, lazy } from "react";
const MovieCard = lazy(() => import('../UI-Elements/movieCard'));
import LoadingCard from "./loadingCard";
import type { Movie } from "./movieCard";
import styles from '../UI-Elements/UI_css/cardList.module.css';

export default function CardList(props: { displayedMovies: Movie[]; }){
    

    return(
        <div className={styles.resultsContainer}>
                    <Suspense fallback={<LoadingCard/>}>
                        <ul className={styles.movieCardList}>
                        {props.displayedMovies.map(movie => (
                            <MovieCard
                                key={movie.tmdbid}
                                tmdbid={movie.tmdbid}
                                poster={movie.poster}
                                title={movie.title}
                                releasedate={movie.releasedate}
                                keywords={movie.keywords}
                                director={movie.director ? movie.director: "unknown"}
                                synopsis={movie.synopsis}
                                franchise={movie.franchise ? movie.franchise: "none"}
                                cast={movie.cast}
                            />
                        ))}
                        </ul>  
                    </Suspense>
                </div>
    )
}