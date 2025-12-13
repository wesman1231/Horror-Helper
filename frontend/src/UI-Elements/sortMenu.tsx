import { useState } from 'react';
import type { sortMode } from '../pages/movies';
import styles from './sortMenu.module.css';

interface SortProps{
    sortMode: sortMode;
    oldestSort: () => void;
    newestSort: () => void;                                                                                                                                                        
    titleSort: () => void;
    directorSort: () => void;
    franchiseSort: () => void;
}

export default function SortMenu(props: SortProps){
    
    const[sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false)

    
    return(
        <div className={styles.dropdown}>
                        {sortOptionsToggle ? (
                        <>
                            <button className={styles.sortBy} onClick={toggleSortOptions}>
                                Sort by {String.fromCodePoint(128315)}
                            </button>

                            <ul className={styles.sortOptions}>
                                <li>
                                    <button onClick={props.oldestSort} style={{ textShadow: props.sortMode === 'releasedate' ? '2px 1px red' : 'none' }}>
                                        Oldest
                                    </button>
                                </li>
                                <li>
                                    <button onClick={props.newestSort} style={{ textShadow: props.sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                        Newest
                                    </button>
                                </li>
                                <li>
                                    <button onClick={props.titleSort} style={{ textShadow: props.sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                        Title
                                    </button>
                                </li>
                                <li>
                                    <button onClick={props.directorSort} style={{ textShadow: props.sortMode === 'director' ? '2px 1px red' : 'none' }}>
                                        Director
                                    </button>
                                </li>
                                <li>
                                    <button onClick={props.franchiseSort} style={{ textShadow: props.sortMode === 'franchise' ? '2px 1px red' : 'none' }}>
                                        franchise
                                    </button>
                                </li>
                            </ul>
                        </>
                        ) : (
                            <button className={styles.sortBy} onClick={toggleSortOptions}>
                                Sort by {String.fromCodePoint(128314)}
                            </button>
                    )}
                    </div>
    )

     function toggleSortOptions(){
        setSortOptionsToggle((prev => !prev));
    }

    
}