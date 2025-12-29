import { useState } from 'react';
import styles from '../UI-Elements/UI_css/searchBar.module.css';
import AddKeywords from './UI_css/addKeyWords';

interface SearchBarProps {
  searchValue: string;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search: () => void;
}

export default function SearchBar(props: SearchBarProps){
    const [toggleAddKeywords, setToggleAddKeywords] = useState(false);
    
    function toggleKeyWords(){
        setToggleAddKeywords(k => !k);
    }

    return(
        <div className={styles.searchBarContainer}>
            <input type='text' id="search-bar"className={styles.searchBar} value={props.searchValue} onChange={props.handleInput} placeholder='Search by title'></input>
                <div className={styles.buttonsWrapper}>
                    <button type='button' className={styles.searchButton} onClick={props.search}>search</button>
                    <button type='button' className={styles.addKeywords} onClick={toggleKeyWords}>+</button>
                    {toggleAddKeywords ? <AddKeywords/> : null}
                </div>
        </div>
    )
}
