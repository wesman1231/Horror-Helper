import { useState, useEffect } from 'react';
import styles from '../UI-Elements/UI_css/pageButtons.module.css';

interface PageProps{
    pages: number[];
    changePage: (page: number) => void;
}

export default function PageButtons(props: PageProps){

    const [width, setWidth] = useState(window.innerWidth);
    const [visiblePages, setVisiblePages] = useState<number>(0); //sets how many page numbers are visible
    const [lowestVisiblePage, setLowestVisiblePage] = useState(0); //sets the lowest visible page number
    const [maxVisiblePage, setMaxVisiblePage] = useState(visiblePages); //sets the highest visible page number

    //when window is resized, run handleResize to set current window with
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleResize(){
        setWidth(window.innerWidth);
    }

    //determine number of visible page numbers based on window width
    function handleVisiblePages(){
        if(width <= 768){
            setVisiblePages(3);
        }
        else if(width > 768){
            setVisiblePages(5);
        }
    }

    //when width changes, handle visible page buttons
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleVisiblePages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    function nextPageBatch(){
        setLowestVisiblePage(min => min + visiblePages);
        setMaxVisiblePage(max => max + visiblePages);
    }

    function previousPageBatch(){
        setLowestVisiblePage(min => min - visiblePages);
        setMaxVisiblePage(max => max - visiblePages);
    }

    //when visible pages updates, update the maximum visible page
    useEffect(() => {
        setMaxVisiblePage(visiblePages);
    }, [visiblePages]);

    return(
        <ul className={styles.pageButtons}>
            {props.pages.length > 3 && lowestVisiblePage != 0 ? <button type='button' key='left' onClick={previousPageBatch}>&#9664;</button> : null}
            {props.pages.slice(lowestVisiblePage, maxVisiblePage).map(page => (
            <button type='button' key={page} onClick={() => props.changePage(page)}>{page}</button>
            ))}
            {props.pages.length > 3 && maxVisiblePage < props.pages.length ? <button type='button' key='right' onClick={nextPageBatch}>&#9654;</button> : null}
        </ul>
    )

}