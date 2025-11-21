import styles from './movies.module.css';

export default function Movies(){


    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} placeholder='Enter a film title, actor, director, etc.'></input>
            </div>
        </>
    )
}