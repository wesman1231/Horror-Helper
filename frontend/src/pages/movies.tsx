import styles from './movies.module.css';
import MovieCard from '../UI-Elements/movieCard';
import { useState } from 'react';

export default function Movies(){

    const [searchValue, setSearchValue] = useState('');

    function handleInput(event: any){
        setSearchValue(event.target.value);
    }

    async function search(){
        console.log("Button clicked!", searchValue);
        const formatSearch = searchValue.replaceAll(' ', "+");
        console.log(formatSearch);
        try{
            const request = await fetch(`http://localhost:3000/api/search/movies?query=${formatSearch}`);
            const response = await request.json();
            console.log(response);
        } catch(error){
            console.error('Error searching: ', error);
        }
    }

    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <button type='button' onClick={search}>search</button>
            </div>
            <div className={styles.resultsContainer}>
                <MovieCard/>
            </div>
        </>
    );
}

