import styles from '../UI-Elements/UI_css/addKeyWords.module.css';

interface keywordsProps{
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddKeywords(props: keywordsProps){

    return(
        <div className={styles.keywordsWrapper}>
            <ul className={styles.keywordsList}>
                <li><input type='checkbox' value='slasher' onChange={props.handleCheckboxChange}></input>slasher</li>
                <li><input type='checkbox' value='ghost' onChange={props.handleCheckboxChange}></input>ghost</li>
                <li><input type='checkbox' value='sequel' onChange={props.handleCheckboxChange}></input>sequel</li>
                <li><input type='checkbox' value='sci-fi horror' onChange={props.handleCheckboxChange}></input>sci-fi horror</li>
                <li><input type='checkbox' value='found footage' onChange={props.handleCheckboxChange}></input>found footage</li>
                <li><input type='checkbox' value='vampire' onChange={props.handleCheckboxChange}></input>vampire</li>
                <li><input type='checkbox' value='zombie' onChange={props.handleCheckboxChange}></input>zombie</li>
                <li><input type='checkbox' value='werewolf' onChange={props.handleCheckboxChange}></input>werewolf</li>
            </ul>
        </div>
    );
}