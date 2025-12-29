import styles from '../UI_css/addKeyWords.module.css';
import useSearch from '../../hooks/useSearch';

export default function AddKeywords(){

    const searchHook = useSearch();

    return(
        <div>
            <ul className={styles.keywordsList}>
                <li><input type='checkbox' value='slasher' onChange={searchHook.handleCheckBoxChange}></input>slasher</li>
                <li><input type='checkbox' value='gore' onChange={searchHook.handleCheckBoxChange}></input>gore</li>
            </ul>
        </div>
    );
}