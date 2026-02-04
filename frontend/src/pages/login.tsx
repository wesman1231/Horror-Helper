import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
    const isVerificationError = error?.message.includes("verify your email");

    if(isAuthenticated){
        navigate('/home');
    }

    /**
     * Component Render
     */
    return (
        <div className={styles.pageContainer}>
            <button type="button" className={styles.button} onClick={() => loginWithRedirect()}>Sign up or log in</button>
            <div>{isLoading ? 'loading...' : null}</div>
            {isVerificationError ?
                <span>Please verify email address to log in</span>
            : 
                null}
        </div>
    );
}
