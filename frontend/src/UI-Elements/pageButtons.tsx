import type { Dispatch, SetStateAction } from "react";
import type { Movie } from "./movieCard";
import styles from './pageButtons.module.css';

interface PageProps{
    allPages: Movie[][]
    currentPage: number;
    setCurrentPage: (Dispatch<SetStateAction<number>>)
}

export default function PageButtons(props: PageProps){

    return(
        <ul className={styles.pageButtons}>
            {props.allPages.map(page => (
                <button type='button' key={props.allPages.indexOf(page)} onClick={() => props.setCurrentPage(props.allPages.indexOf(page))} >{props.allPages.indexOf(page) + 1}</button>
            ))}
        </ul>
    )
}