import { NavLink } from "react-router-dom";
import styles from '../UI-Elements/UI_css/Header.module.css';
import { useAuth0 } from "@auth0/auth0-react";

export default function Header(){

    const { logout } = useAuth0();

    return(
        <>
            <header className={styles.header}>
                <h1>Horror Helper</h1>
                <nav>
                    <NavLink to = '/home' className={styles.headerLink}>Home</NavLink>
                    <NavLink to = '/search/movies' className={styles.headerLink}>Movies</NavLink>
                    <NavLink to = '/search/shows' className={styles.headerLink}>Television</NavLink>
                    <button type='button' onClick={() => logout()}>Sign Out</button>
                </nav>
            </header>
        </>
    )
}