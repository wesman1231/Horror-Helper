import styles from '../pages/pages_css/Home.module.css';
import { useNavigate } from 'react-router'

export default function Home(){
    const navigate = useNavigate();


    const navigateToNewReleases = () =>{
        navigate('/new-releases');
    }


    return(
        <>
            <div className={styles.buttonContainer}>
                <button onClick={navigateToNewReleases} className={`${styles.menuButton} ${styles.newReleases}`}>New Releases</button> {/* Go to the new releases page */}
            </div>
        </>
    )
}