import { NavLink } from "react-router-dom";
import styles from '../UI-Elements/UI_css/Header.module.css';
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useEffect, useState } from "react";

//TODO: CONDITIONALLY RENDER HEADER ONLY IF USER IS LOGGED IN

export default function Header(){
    const [headerVisible, setHeaderVisible] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>();
    const auth = getAuth(app);

    //CURRENT USER NEEDS TO BE STATEFUL
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                setCurrentUser(user);
            }
            else{
                setCurrentUser(null);
            }
        });
    }, []);
    
    useEffect(() => {
        if(currentUser === null){
            setHeaderVisible(false);
        }
        else{
            setHeaderVisible(true);
        }
    }, [currentUser]);

    async function signUserOut(){
        try{
            await signOut(auth);
        }
        catch(error){
            console.error(error);
        }
    }

    return(
        <>
            {headerVisible ?
            <header>
                <h1>Horror Helper</h1>
                <nav>
                    <NavLink to = '/' className={styles.headerLink}>Home</NavLink>
                    <NavLink to = '/search/movies' className={styles.headerLink}>Movies</NavLink>
                    <NavLink to = '/search/shows' className={styles.headerLink}>Television</NavLink>
                    <button type='button' onClick={signUserOut}>Sign Out</button>
                </nav>
            </header>
            :
            null}
        </>
    )
}