
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';
import { useEffect } from "react";

export default function Login() {
    const navigate = useNavigate();
    const {isAuthenticated, isLoading, error} = useAuth0();

    const isVerificationError = error?.message.includes("verify your email");

    function checkAuth(){
        if(isAuthenticated){
            navigate('/home');
        }
    }

    useEffect(() => {
        checkAuth();
    }, [isAuthenticated]);

    /**
     * Component Render
     */
    return (
        <div className={styles.pageContainer}>
            <button type="button" className={styles.button} onClick={() => navigate('/login')}>log in</button>
            {isLoading ?
                <span>loading...</span>
            :
                null}
            {isVerificationError ?
                <div>
                    <p className={styles.verifyEmail}>Please verify email address to log in</p>
                    <button type='button' className={styles.button}>resend email verification</button>
                </div>
            : 
                null}
        </div>
    );
}
