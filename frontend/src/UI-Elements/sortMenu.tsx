import { useState } from 'react';
import styles from '../UI-Elements/UI_css/sortMenu.module.css';
import type { sortModes } from '../hooks/useSearch';

interface sortProps{
    mediaType: string | undefined;
    sortMode: sortModes,
    relevanceSort: () => void;
    titleSort: () => void;
    oldestSort: () => void;
    newestSort: () => void;
    directorSort: () => void;
    franchiseSort: () => void;
    firstAiredSort: () => void;
    lastAiredSort: () => void;
    creatorSort: () => void;
}   

export default function SortMenu(props: sortProps){
    
    const[sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false);

     function toggleSortOptions(){
        setSortOptionsToggle((prev => !prev));
    }

     return(
        //checks if sortOptionsToggle is active and if the page is sorting movies or shows and renders the correct sort list accordingly
        <div className={styles.dropdown}>
            {sortOptionsToggle
            ? props.mediaType === 'movies'
                ?   <>
                        <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128315)}</button>
                        <ul className={styles.sortOptions}>
                            <button onClick={props.relevanceSort} style={{ textShadow: props.sortMode === 'relevance' ? '2px 1px red' : 'none' }}>Relevance</button>
                            <button onClick={props.oldestSort} style={{ textShadow: props.sortMode === 'releasedate' ? '2px 1px red' : 'none' }}>Oldest</button>
                            <button onClick={props.newestSort} style={{ textShadow: props.sortMode === 'newest' ? '2px 1px red' : 'none' }}>Newest</button>
                            <button onClick={props.titleSort} style={{ textShadow: props.sortMode === 'title' ? '2px 1px red' : 'none' }}>Title</button>
                            <button onClick={props.directorSort} style={{ textShadow: props.sortMode === 'director' ? '2px 1px red' : 'none' }}>Director</button>
                            <button onClick={props.franchiseSort} style={{ textShadow: props.sortMode === 'franchise' ? '2px 1px red' : 'none' }}>Franchise</button>
                        </ul>
                    </>
                : <>
                        <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128315)}</button>
                        <ul className={styles.sortOptions}>
                            <button onClick={props.relevanceSort} style={{ textShadow: props.sortMode === 'relevance' ? '2px 1px red' : 'none' }}>Relevance</button>
                            <button onClick={props.firstAiredSort} style={{ textShadow: props.sortMode === 'firstairdate' ? '2px 1px red' : 'none' }}>First Aired</button>
                            <button onClick={props.lastAiredSort} style={{ textShadow: props.sortMode === 'lastairdate' ? '2px 1px red' : 'none' }}>Last Aired</button>
                            <button onClick={props.titleSort} style={{ textShadow: props.sortMode === 'title' ? '2px 1px red' : 'none' }}>Title</button>
                            <button onClick={props.creatorSort} style={{ textShadow: props.sortMode === 'creator' ? '2px 1px red' : 'none' }}>Creator</button>
                        </ul>
                    </>
                
                
        
        : <button className={styles.sortBy} onClick={toggleSortOptions}>Sort by {String.fromCodePoint(128314)}</button>}
        </div>
    );
    
}