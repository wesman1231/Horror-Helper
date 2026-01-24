import LoginError from '../UI-Elements/loginError';

import InputValidationError from '../UI-Elements/inputValidationError';

// React Router utilities for navigation and links
import { Link } from 'react-router';

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';

// React state management
import { useEffect } from 'react';

//import login hook
import useLogin from '../hooks/useLogin'; 


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
        <div className={styles.pageContainer}>
            <div className={styles.loginWrapper}>
            
            {/* Wrapper for inputs */}
                <div className={styles.inputsWrapper}>
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
                </div>

                <div className={styles.errorWrapper}>
                    {/* Backend validation error */}
                    {loginLogic.error !== null
                        ? <InputValidationError inputError={loginLogic.error}/>
                        : null}

                    {/* Firebase authentication error */}
                    {loginLogic.loginError !== '' 
                        ? <LoginError loginError={loginLogic.loginError} />
                        : null}
                </div>

                {/* Wrapper for links */}
                <div className={styles.linksWrapper}>
                    <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password</Link>

                    {/* Navigation to signup page */}
                    <span>
                        Don't have an account? <Link to='/signup'>Sign up</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
