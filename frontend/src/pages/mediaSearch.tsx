import useSearch from "../hooks/useSearch";
import CardList from "../UI-Elements/cardList";
import NoResultsFound from "../UI-Elements/noResultsFound";
import SearchBar from "../UI-Elements/searcBar";
import PageButtons from "../UI-Elements/pageButtons";
import SortMenu from "../UI-Elements/sortMenu";
import { useParams } from "react-router";
import type { Movie } from "../UI-Elements/movieCard";
import type { Show } from "../UI-Elements/tvCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useNavigate } from "react-router";

export type mediaType = 'movies' | 'shows';

export default function MediaSearch(){
    const { mediaType } = useParams<{ mediaType: mediaType }>();
    const searchHook = useSearch();
    const navigate = useNavigate();

    //check if user is logged in, if they are not, redirect them to log in page
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });
    
    if (!mediaType) {
        return <div>Invalid media type</div>;
    }

    return(
        <>
            <SearchBar searchHook={searchHook}  />
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
            <PageButtons pages={searchHook.pages} changePage={searchHook.changePage} previousSearch={searchHook.previousSearch} sortMode={searchHook.sortMode} />
        </>
    );
}

