import { NavLink } from "react-router-dom";
import styles from '../UI-Elements/UI_css/Header.module.css';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";

//TODO: CONDITIONALLY RENDER HEADER ONLY IF USER IS LOGGED IN

export default function Header(){
    
    const auth = getAuth(app);

    return(
        <>
            <header>
                <h1>Horror Helper</h1>
                <nav>
                    <NavLink to = '/' className={styles.headerLink}>Home</NavLink>
                    <NavLink to = '/search/movies' className={styles.headerLink}>Movies</NavLink>
                    <NavLink to = '/search/shows' className={styles.headerLink}>Television</NavLink>
                    <button type='button' onClick={() => signOut(auth)}>Sign Out</button>
                </nav>
            </header>
        </>
    )
}