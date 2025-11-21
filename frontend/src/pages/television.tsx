import styles from './television.module.css';

export default function Television(){
    
    
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} placeholder='Enter a show title, actor, director, etc.'></input>
            </div>
        </>
    )
}