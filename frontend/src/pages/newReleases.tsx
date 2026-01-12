import styles from '../pages/pages_css/newReleases.module.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";
import { useNavigate } from "react-router";
export default function NewReleases(){
    const currentDate: Date = new Date();    
    
    const navigate = useNavigate();

    //check if user is logged in, if they are not, redirect them to log in page
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if(!user){
            navigate('/');
        }
    });

    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
        </>
    )
}