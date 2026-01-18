import styles from '../pages/pages_css/provenClassics.module.css';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';


export default function ProvenClassics(){
    const navigate = useNavigate();
    const auth = getAuth(app);

    //check if user is logged in, if they are not, redirect them to log in page
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });
    }, []);
    
    return(
        <>
            <h2 className={styles.headerText}>Proven Classics</h2>
        </>
    )
}