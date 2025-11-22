import styles from './movies.module.css';
import MovieCard from '../UI-Elements/movieCard';


export default function Movies(){


    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} placeholder='Enter a film title, actor, director, etc.'></input>
            </div>
            <div className={styles.resultsContainer}>
                <MovieCard/>
            </div>
            
        </>
    );
}