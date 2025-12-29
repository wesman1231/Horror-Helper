import styles from '../UI_css/addKeyWords.module.css';

interface keywordsProps{
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddKeywords(props: keywordsProps){

    return(
        <div>
            <ul className={styles.keywordsList}>
                <li><input type='checkbox' value='slasher' onChange={props.handleCheckboxChange}></input>slasher</li>
                <li><input type='checkbox' value='gore' onChange={props.handleCheckboxChange}></input>gore</li>
                <li><input type='checkbox' value='sequel' onChange={props.handleCheckboxChange}></input>sequel</li>
            </ul>
        </div>
    );
}