import styles from '../UI-Elements/UI_css/searchBar.module.css';

interface SearchBarProps {
  searchValue: string;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search: () => void;
}

export default function SearchBar(props: SearchBarProps){
    return(
        <div className={styles.searchBarContainer}>
            <input type='text' id="search-bar"className={styles.searchBar} value={props.searchValue} onChange={props.handleInput} placeholder='Search by title'></input>
            <button type='button' className={styles.searchButton} onClick={props.search}>search</button>
        </div>
    )
}
