// React Router utilities for navigation and links
import { Link, useNavigate } from 'react-router';

// CSS module for scoped component styles
import styles from '../pages/pages_css/login.module.css';

// React state management
import { useEffect, useState } from 'react';

// Firebase app instance
import { app } from '../firebase/firebase';

// Firebase authentication methods
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

/**
 * Shape of the login payload sent to the backend API
 */
interface LoginData {
    email: string;
    password: string;
}

/**
 * Login Component
 * ----------------
 * Handles user authentication by:
 * 1. Sending credentials to the backend for validation
 * 2. Signing the user into Firebase Authentication
 * 3. Enforcing email verification
 * 4. Redirecting authenticated users to /home
 */
export default function Login() {
    // Initialize Firebase Auth
    const auth = getAuth(app);

    // Stores the user's email input
    const [email, setEmail] = useState<string>('');

    // Stores the user's password input
    const [password, setPassword] = useState<string>('');

    // Stores backend validation error messages
    const [error, setError] = useState();

    // Stores Firebase authentication errors
    const [loginError, setLoginError] = useState<string>('');

    // React Router navigation hook
    const redirect = useNavigate();

    /**
     * Updates email state when the user types in the email input
     */
    function handleEmailValue(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    /**
     * Updates password state when the user types in the password input
     */
    function handlePasswordValue(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    //if user is logged in and they attempt to navigate to login page, redirect them to home page
    useEffect(() => {
        if(auth.currentUser !== null){
            redirect('/home');
        }
    }, []);

    /**
     * Attempts to log the user in
     * ---------------------------
     * 1. Sends credentials to backend for validation
     * 2. If valid, signs user into Firebase Auth
     * 3. Confirms email is verified
     * 4. Redirects user on success
     */
    async function loginAttempt(email: string, password: string) {
    
        // Payload sent to backend
        const loginData: LoginData = {
            email: email,
            password: password
        };

        try {
            // Send login request to backend API
            const loginRequest = await fetch(`http://localhost:3000/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            // Parse backend response
            const loginResponse = await loginRequest.json();

            // If backend returns validation errors, display them
            if (Object.hasOwn(loginResponse, 'errors')) {
                setError(
                    loginResponse.errors[0].msg.replaceAll(
                        'value',
                        loginResponse.errors[0].path
                    )
                );
            }
            else {
                try {
                    // Attempt Firebase login
                    await signInWithEmailAndPassword(auth, email, password);

                    // Block login if email is not verified
                    if (!auth.currentUser?.emailVerified) {
                        try {
                            // Immediately sign user out
                            await signOut(auth);
                            console.log("Verify email to log in");
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    else {
                        // Successful login → redirect to home
                        redirect('/home');
                        console.log("logged in");
                    }
                }
                catch (error) {
                    // Firebase authentication error
                    console.error(error);
                    setLoginError(String(error));
                }
            }
        }
        catch (error) {
            // Network or server error
            console.error(error);
        }
    }

    /**
     * Component Render
     */
    return (
        <div className={styles.loginWrapper}>
            <label htmlFor="email">Email: </label>
            <input
                type="email"
                name="email"
                onChange={handleEmailValue}
            />

            <label htmlFor="password">Password: </label>
            <input
                type="password"
                name="password"
                onChange={handlePasswordValue}
            />

            {/* Trigger login attempt */}
            <button
                type='button'
                className={styles.loginButton}
                onClick={() => loginAttempt(email, password)}
            >
                Log in
            </button>

            {/* Backend validation error */}
            <span>{error !== undefined ? `${error}` : null}</span>

            {/* Firebase authentication error */}
            <span>{loginError !== undefined ? `${loginError}` : null}</span>

            {/* Navigation to signup page */}
            <span>
                Don't have an account? <Link to='/signup'>Sign up</Link>
            </span>
        </div>
    );
}
