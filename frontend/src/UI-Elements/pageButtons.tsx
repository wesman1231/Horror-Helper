import styles from './pageButtons.module.css';

interface PageProps{
    pages: number[];
    changePage: (page: number) => void;
}

export default function PageButtons(props: PageProps){

    return(
        <ul className={styles.pageButtons}>
            {props.pages.map(page => (
                <button type='button' key={page} onClick={() => props.changePage(page)}>{page}</button>
            ))}
        </ul>
    )

    
}