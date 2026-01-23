// React Router utilities for navigation and links
import { Link } from 'react-router';

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';

// React state management
import { useEffect } from 'react';

//import login hook
import useLogin from '../hooks/useLogin'; 

//import input validation error interface from login hook
import type { Error } from '../hooks/useLogin';


export default function Login() {
    const loginLogic = useLogin();

     //if user is logged in and they attempt to navigate to login page, redirect them to home page
    useEffect(() => {
        if(loginLogic.currentUser !== null){
            loginLogic.redirect('/home');
        }
    }, []);

    /**
     * Component Render
     */
    return (
        <div className={styles.loginWrapper}>
            <label htmlFor="Email">Email: </label>
            <input
                id="Email"
                type="Email"
                name="Email"
                autoComplete="true"
                onChange={loginLogic.handleEmailValue}
            />

            <label htmlFor="Password">Password: </label>
            <input
                id="Password"
                type="Password"
                name="Password"
                onChange={loginLogic.handlePasswordValue}
            />

            {/* Trigger login attempt */}
            <button
                type='button'
                className={styles.loginButton}
                onClick={() => loginLogic.loginAttempt(loginLogic.email, loginLogic.password)}
            >
                Log in
            </button>

            {/* Backend validation error */}
            <span>{loginLogic.error !== undefined 
            ? <ul className={styles.errorsList}>
                {loginLogic.error?.map((error: Error) => 
                    <li key={error.msg} className={styles.error}>{`${error.msg}`}</li>
                )}
              </ul> 
              : null}</span>

            {/* Firebase authentication error */}
            <span className={styles.error}>{loginLogic.loginError !== '' 
            ? `${loginLogic.loginError}`
            : null}
            </span>

            <span>
                <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password</Link>
            </span>

            {/* Navigation to signup page */}
            <span>
                Don't have an account? <Link to='/signup'>Sign up</Link>
            </span>
        </div>
    );
}
