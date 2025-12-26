import useSearch from "../hooks/useSearch";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";
import { useParams } from "react-router";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";

export type mediaType = 'movies' | 'shows'

export default function MediaSearch(){
    const { mediaType } = useParams<{ mediaType: mediaType }>();
    const searchHook = useSearch();

    if (!mediaType) {
        return <div>Invalid media type</div>; // or redirect somewhere
    }

    return(
        <>
            <SearchBar searchValue={searchHook.searchValue} handleInput={searchHook.handleInput} search={searchHook.search} />
            {searchHook.sortMenuVisible ? <SortMenu mediaType={mediaType} 
                                                    sortMode={searchHook.sortMode} 
                                                    relevanceSort={searchHook.relevanceSort} 
                                                    titleSort={searchHook.titleSort} 
                                                    oldestSort={searchHook.oldestSort} 
                                                    newestSort={searchHook.newestSort} 
                                                    directorSort={searchHook.directorSort}
                                                    franchiseSort={searchHook.franchiseSort}
                                                    firstAiredSort={searchHook.firstAiredSort}
                                                    lastAiredSort={searchHook.lastAiredSort}
                                                    creatorSort={searchHook.creatorSort}  /> : null}
            {searchHook.pages === undefined ? <NoResultsFound /> : null}
            {mediaType === "movies" ? <CardList mediaType="movies" results={searchHook.displayedResults as Movie[]} /> : <CardList mediaType="shows" results={searchHook.displayedResults as Show[]} />}       
            {searchHook.pages === undefined ? <PageButtons pages={searchHook.pages} changePage={searchHook.changePage} previousSearch={searchHook.previousSearch} sortMode={searchHook.sortMode} /> : null}
        </>
    );
}

