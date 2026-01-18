import styles from '../pages/pages_css/newReleases.module.css'
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
export default function NewReleases(){
    const currentDate: Date = new Date();    
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

    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
        </>
    )
}