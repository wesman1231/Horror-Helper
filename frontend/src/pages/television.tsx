import styles from './television.module.css';
import type {Show} from '../UI-Elements/tvCard';
import TVCard from '../UI-Elements/tvCard';
import { useState } from 'react';

export default function Television(){
    const [searchValue, setSearchValue] = useState<string>('');
    const [shows, setShows] = useState<Show[]>([]);
    const [defaultShows, setDefaultShows] = useState<Show[]>([]);
    const [sortOptionsToggle, setSortOptionsToggle] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    type SortMode = 'default' | 'newest' | 'title' | 'director' | 'franchise';
    const [sortMode, setSortMode] = useState<SortMode>('default');

    

    function handleInput(event: React.ChangeEvent<HTMLInputElement>){
        setSearchValue(event.target.value);
    }

    async function search(){
        //search for shows
        const formatSearch = searchValue.replaceAll(' ', "+");
        try{
            const request = await fetch(`http://localhost:3000/api/search/shows?query=${formatSearch}`);
            const response = await request.json();
            
            setError(false);
            setShows(response.findResult);
            setDefaultShows([...response.findResult]);
            console.log(response);
        } 
        catch(error){
            setError(true);
            console.error(error);
        }
    }

    //toggle sort options menu
    function sortMenuToggle(){
        if(sortOptionsToggle === false){
            setSortOptionsToggle(true);
        }
        
        else if(sortOptionsToggle === true){
            setSortOptionsToggle(false);
        }
    }

    //sorts
    function defaultSort(){
        //sort from oldest to newest
        setShows(defaultShows);
        setSortMode('default');
    }

    function releaseDateSort(){
        //sort from newest to oldest
         const shallowCopyShows: Show[] = [...defaultShows];
         const sortByReleaseDate = shallowCopyShows.sort((show, nextShow) => nextShow.firstairdate.localeCompare(show.firstairdate));
         
         setShows(sortByReleaseDate);
         setSortMode('newest');
    }

    function titleSort(){
        //sort title from A-Z
        const shallowCopyShows: Show[] = [...defaultShows];
        const sortByTitle = shallowCopyShows.sort((show, nextShow) => show.title.localeCompare(nextShow.title));
        
        setShows(sortByTitle);
        setSortMode('title');
    }


    //if there are no results found, render no results found header
    if(error === true){
        return(
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <div className={styles.dropdown}>
                    {sortOptionsToggle ? (
                    <>
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128315)}
                        </h2>

                        <ul className={styles.sortOptions}>
                            <li onClick={defaultSort} style={{ textShadow: sortMode === 'default' ? '2px 1px red' : 'none' }}>
                                Oldest
                            </li>
                            <li onClick={releaseDateSort} style={{ textShadow: sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                Newest
                            </li>
                            <li onClick={titleSort} style={{ textShadow: sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                Title
                            </li>
                        </ul>
                    </>
                    ) : (
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128314)}
                        </h2>
                )}
                </div>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
                <h2 className={styles.noResultsFound}>No Results Found</h2>
            </div>
        );
    }


    //otherwise, render results
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type='text' id="search-bar"className={styles.searchBar} value={searchValue} onChange={handleInput} placeholder='Enter a film title, actor, director, etc.'></input>
                <div className={styles.dropdown}>
                    {sortOptionsToggle ? (
                    <>
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128315)}
                        </h2>

                        <ul className={styles.sortOptions}>
                            <li onClick={defaultSort} style={{ textShadow: sortMode === 'default' ? '2px 1px red' : 'none' }}>
                                Oldest
                            </li>
                            <li onClick={releaseDateSort} style={{ textShadow: sortMode === 'newest' ? '2px 1px red' : 'none' }}>
                                Newest
                            </li>
                            <li onClick={titleSort} style={{ textShadow: sortMode === 'title' ? '2px 1px red' : 'none' }}>
                                Title
                            </li>
                        </ul>
                    </>
                    ) : (
                        <h2 className={styles.sortBy} onClick={sortMenuToggle}>
                            Sort by {String.fromCodePoint(128314)}
                        </h2>
                )}
                </div>
                <button type='button' className={styles.searchButton} onClick={search}>search</button>
            </div>
            <div className={styles.resultsContainer}>
                <ul className={styles.showCardList}>
                    {shows.map(show => (
                        <TVCard
                            key={show.tmdbid}
                            tmdbid={show.tmdbid}
                            title={show.title}
                            poster={show.poster}
                            keywords={show.keywords}
                            firstairdate={show.firstairdate}
                            lastairdate={show.lastairdate}
                            seasons={show.seasons}
                            episodes={show.episodes}
                            creator={show.creator}
                            synopsis={show.synopsis}
                        />
                ))}
                </ul>
            </div>
        </>
    );
}