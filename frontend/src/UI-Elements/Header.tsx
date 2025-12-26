import { NavLink } from "react-router-dom";
import styles from '../UI-Elements/UI_css/Header.module.css';

export default function Header(){
    return(
        <>
            <header>
                <h1>Horror Helper</h1>
                <nav>
                    <NavLink to = '/' className={styles.headerLink}>Home</NavLink>
                    <NavLink to = '/search/movies' className={styles.headerLink}>Movies</NavLink>
                    <NavLink to = '/search/shows' className={styles.headerLink}>Television</NavLink>
                </nav>
            </header>
        </>
    )
}