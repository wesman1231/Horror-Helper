import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import styles from '../pages/pages_css/Home.module.css';
import { useNavigate } from 'react-router'
import { useEffect } from 'react';



export default function Home(){
    const navigate = useNavigate();
    const auth = getAuth(app);

    //check if user is logged in, if not, redirect them to log in page
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });
    }, []);

    const navigateToNewReleases = () =>{
        navigate('/new-releases');
    }

    const navigateToProvenClassics = () =>{
        navigate('/proven-classics');
    }

    const navigateToHiddenGems = () =>{
        navigate('/hidden-gems');
    }

    const navigateToSurpriseMe = () =>{
        //add logic here to select a random movie or show page
    }

    return(
        <>
            <div className={styles.buttonContainer}>
                <button onClick={navigateToNewReleases} className={`${styles.menuButton} ${styles.newReleases}`}>New Releases</button> {/* Go to the new releases page */}
                <button onClick={navigateToProvenClassics} className={`${styles.menuButton} ${styles.provenClassics}`}>Proven Classics</button> {/* Go to the proven classics page */}
                <button onClick={navigateToHiddenGems} className={`${styles.menuButton} ${styles.hiddenGems}`}>Hidden Gems</button> {/* Go to the hidden gems page */}
                <button onClick={navigateToSurpriseMe} className={`${styles.menuButton} ${styles.surpriseMe}`}>Surprise me</button> {/* Pick a random film or show */}
            </div>
        </>
    )
}