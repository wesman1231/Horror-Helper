import styles from '../pages/pages_css/newReleases.module.css'
import { useEffect, useState } from 'react';
import type { Movie } from '../UI-Elements/movieCard';
import type { Show } from '../UI-Elements/tvCard';
import type { mediaType } from './mediaSearch';
import CardList from '../UI-Elements/cardList';

export default function NewReleases(){
    interface NewReleasesResponse{
        newReleases: Movie[] | Show[];
        numberOfPages: number;
    }
    
    const currentDate: Date = new Date();    

    const [results, setResults] = useState<Movie[] | Show[]>([]);
    const [mediaDisplayed, setMediaDisplayed] = useState<mediaType>('movies');
    const [page, setPage] = useState<number>(0);
    const [numOfPages, setNumOfPages] = useState<number>(0);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    useEffect(() => {
        function handleScroll(){
            setScrollPosition(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    async function getNewMedia(page: number, mediaType: mediaType){
       try{
            setMediaDisplayed(mediaType);
            const fetchNewMedia = await fetch(`http://localhost:3000/api/${mediaType}/new-releases?page=${page}`);
            const fetchResults: NewReleasesResponse = await fetchNewMedia.json();
            console.log(fetchResults);
            setNumOfPages(fetchResults.numberOfPages)
            setResults(fetchResults.newReleases);
       }
       catch(error){
            console.error(error);
       }
    }

    useEffect(() => {
        async function scrollFetch(){
            const windowHeight = window.innerHeight;
            const queryPosition = windowHeight * 3.5;
            
            if(scrollPosition >= queryPosition && page < numOfPages){
                setPage((prev) => prev + 1);
                await getNewMedia(page, mediaDisplayed!);
            }
        }

        scrollFetch();
    }, [scrollPosition]);

    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
            <nav className={styles.contentNav}>
                <button onClick={() => getNewMedia(0, 'movies')}>Movies</button>
                <button onClick={() => getNewMedia(0, 'shows')}>Shows</button>
            </nav>
   
            {mediaDisplayed === "movies" ? (
            <CardList
                mediaType="movies"
                results={results as Movie[]}
            />
        ) : (
            <CardList
                mediaType="shows"
                results={results as Show[]}
            />
        )}
        </>
    )
}