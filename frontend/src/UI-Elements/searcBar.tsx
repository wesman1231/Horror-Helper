import { useState } from 'react';
import styles from '../UI-Elements/UI_css/searchBar.module.css';
import AddKeywords from './UI_css/addKeyWords';
import type { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
    searchHook: useSearch;
}

export default function SearchBar(props: SearchBarProps){
    const [toggleAddKeywords, setToggleAddKeywords] = useState(false);
    
    function toggleKeyWords(){
        setToggleAddKeywords(k => !k);
    }

    return(
        <div className={styles.searchBarContainer}>
            <input type='text' id="search-bar"className={styles.searchBar} value={props.searchHook.searchValue} onChange={props.searchHook.handleInput} placeholder='Search by title'></input>
                <div className={styles.buttonsWrapper}>
                    <button type='button' className={styles.searchButton} onClick={props.searchHook.search}>search</button>
                    <button type='button' className={styles.addKeywords} onClick={toggleKeyWords}>{toggleAddKeywords ? String.fromCodePoint(128315) : String.fromCodePoint(128314)}</button>
                </div>
                {toggleAddKeywords ? <AddKeywords handleCheckboxChange={props.searchHook.handleCheckboxChange}/> : null}
        </div>
    )
}
