import { Suspense, lazy } from "react";
const MovieCard = lazy(() => import('../UI-Elements/movieCard'));
const TVCard = lazy(() => import('../UI-Elements/tvCard'));
import LoadingCard from "./loadingCard";
import type { Movie } from "./movieCard";
import type { Show } from "./tvCard";
import styles from '../UI-Elements/UI_css/cardList.module.css';

type CardListProps =
  | { variant: 'movies'; results: Movie[] }
  | { variant: 'shows'; results: Show[] };

export default function CardList(props: CardListProps){
    
    return(
        <div className={styles.resultsContainer}>
                <Suspense fallback={<LoadingCard/>}>
                    <ul className={styles.movieCardList}>
                        {props.variant === 'movies' 
                        ? props.results.map(movie => (
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
                        )): props.results.map(show => (
                        <TVCard
                            key={show.tmdbid}
                            tmdbid={show.tmdbid}
                            poster={show.poster}
                            title={show.title}
                            firstairdate={show.firstairdate}
                            lastairdate={show.lastairdate}
                            seasons={show.seasons}
                            episodes={show.episodes}
                            keywords={show.keywords}
                            creator={show.creator ? show.creator: "unknown"}
                            synopsis={show.synopsis}
                        />

                    ))}
                    </ul>  
                </Suspense>
        </div>
    )
}