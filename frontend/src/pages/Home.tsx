import styles from '../pages/pages_css/Home.module.css';
import { useNavigate } from 'react-router'

export default function Home(){
    const navigate = useNavigate();


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