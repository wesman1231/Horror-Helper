import styles from './UI_css/signInOrOutButton.module.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function SignInOrOutButton() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    if (isAuthenticated) {
        return (
            <button 
                type="button" 
                className={styles.button} 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
                Log Out
            </button>
        );
    }

    return (
        <button 
            type="button" 
            className={styles.button} 
            onClick={() => loginWithRedirect()}
        >
            Log In
        </button>
    );
}