import { useState } from 'react';
import type { sortModeMovies } from '../pages/movies';
import type { sortModeShows } from '../pages/television';
import styles from '../UI-Elements/UI_css/sortMenu.module.css';

interface movieSortProps{
    sortMode: sortModeMovies;
    oldestSort: () => void;
    newestSort: () => void;                                                                                                                                                        
    titleSort: () => void;
    directorSort: () => void;
    franchiseSort: () => void;
}

interface showSortProps{
    sortMode: sortModeShows;
    firstAiredSort: () => void;
    lastAiredSort: () => void;
    titleSort: () => void;
    creatorSort: () => void;
}

type sortProps =
  | { variant: 'movies'; sortType: movieSortProps }
  | { variant: 'shows'; sortType: showSortProps};

export default function SortMenu(props: sortProps){
    
    const[sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false);

     function toggleSortOptions(){
        setSortOptionsToggle((prev => !prev));
    }

     return(
        //checks if sortOptionsToggle is active and if the page is sorting movies or shows and renders the correct sort list accordingly
        <div className={styles.dropdown}>
            {sortOptionsToggle
            ? props.variant === 'movies'
                ?   <>
                        <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128315)}</button>
                        <ul className={styles.sortOptions}>
                            <button onClick={props.sortType.oldestSort} style={{ textShadow: props.sortType.sortMode === 'releasedate' ? '2px 1px red' : 'none' }}>Oldest</button>
                            <button onClick={props.sortType.newestSort} style={{ textShadow: props.sortType.sortMode === 'newest' ? '2px 1px red' : 'none' }}>Newest</button>
                            <button onClick={props.sortType.titleSort} style={{ textShadow: props.sortType.sortMode === 'title' ? '2px 1px red' : 'none' }}>Title</button>
                            <button onClick={props.sortType.directorSort} style={{ textShadow: props.sortType.sortMode === 'director' ? '2px 1px red' : 'none' }}>Director</button>
                            <button onClick={props.sortType.franchiseSort} style={{ textShadow: props.sortType.sortMode === 'franchise' ? '2px 1px red' : 'none' }}>Franchise</button>
                        </ul>
                    </>
                : <>
                        <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128315)}</button>
                        <ul className={styles.sortOptions}>
                            <button onClick={props.sortType.firstAiredSort} style={{ textShadow: props.sortType.sortMode === 'firstairdate' ? '2px 1px red' : 'none' }}>First Aired</button>
                            <button onClick={props.sortType.lastAiredSort} style={{ textShadow: props.sortType.sortMode === 'lastairdate' ? '2px 1px red' : 'none' }}>Last Aired</button>
                            <button onClick={props.sortType.titleSort} style={{ textShadow: props.sortType.sortMode === 'title' ? '2px 1px red' : 'none' }}>Title</button>
                            <button onClick={props.sortType.creatorSort} style={{ textShadow: props.sortType.sortMode === 'creator' ? '2px 1px red' : 'none' }}>Creator</button>
                        </ul>
                    </>
                
                
        
        : <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128314)}</button>}
        </div>
    );
    
}