import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';

export default function Login() {
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();
    const { isAuthenticated } = useAuth0();
    const { isLoading } = useAuth0();

    if(isAuthenticated){
        navigate('/home');
    }

    /**
     * Component Render
     */
    return (
        <div className={styles.pageContainer}>
            <button type="button" onClick={() => loginWithRedirect()}>Sign up or log in</button>
            <div>{isLoading ? 'loading...' : null}</div>
        </div>
    );
}
