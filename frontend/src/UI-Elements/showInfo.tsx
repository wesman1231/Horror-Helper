import { useState } from "react";
import type { Show } from "./tvCard"
import styles from '../UI-Elements/UI_css/showInfo.module.css';
import ExtraShowInfo from "./extraShowInfo";

interface showProps{
    showData: Show | null;
}

export default function ShowInfo(props: showProps){
    
    const [infoDropdown, setInfoDropdown] = useState<boolean>(false);

    function toggleInfo(){
        if(infoDropdown === false){
            setInfoDropdown(true);
        }
        else{
            setInfoDropdown(false);
        }
    }

    return(
        <section className={styles.showWrapper}>
            <h2 className={styles.showTitle}>{props.showData?.title}</h2>
            <img src={`https://media.themoviedb.org/t/p/w260_and_h390_face${props.showData?.poster}`}></img>
            <h3 className={styles.releaseDate}>Premiere Date: {props.showData?.firstairdate}</h3>
            <h3 className={styles.releaseDate}>Finale Date: {props.showData?.lastairdate}</h3>
            <h3 className={styles.seasons}>Seasons: {props.showData?.seasons}</h3>
            <h3 className={styles.episodes}>Episodes: {props.showData?.episodes}</h3>
            <button className={styles.dropdown} onClick={toggleInfo} >Show More {infoDropdown ? String.fromCodePoint(128315) : String.fromCodePoint(128314)}</button>
            {infoDropdown ? <ExtraShowInfo showData={props.showData} /> : null}
        </section>
    );
}