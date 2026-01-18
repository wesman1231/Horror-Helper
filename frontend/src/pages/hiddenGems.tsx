import styles from '../pages/pages_css/hiddenGems.module.css';
import { useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useNavigate } from 'react-router';

export default function HiddenGems(){
    //check if user is logged in, if not, redirect them to log in page
    const navigate = useNavigate();    
    const auth = getAuth(app);

    useEffect(() => {
            onAuthStateChanged(auth, (user) => {
            if(!user){
                navigate('/');
            }
        });
        }, []);
    
    return(
        <>
            <h2 className={styles.headerText}>Hidden Gems</h2>
        </>
    )
}