// React Router utilities for navigation and links
import { useNavigate, type NavigateFunction } from 'react-router';

// React state management
import { useState } from 'react';

// Firebase app instance
import { app } from '../firebase/firebase';

// Firebase authentication methods
import { getAuth, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";

/**
 * Shape of the login payload sent to the backend API
 */
interface LoginData {
    email: string;
    password: string;
}

/* Defines properties of a backend user input validation check error */
export interface Error {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}

/* Defines properties of the object returned by this hook that contains all state variables and functions */
interface LoginHook{
    currentUser: User | null;
    email: string;
    password: string;
    error: Error[] | null;
    loginError: string;
    redirect: NavigateFunction;
    handleEmailValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    loginAttempt: (email: string, password: string) => Promise<void>;
}

/**
 * Login Hook
 * ----------------
 * Handles user authentication by:
 * 1. Sending credentials to the backend for validation
 * 2. Signing the user into Firebase Authentication
 * 3. Enforcing email verification
 * 4. Redirecting authenticated users to /home
 */
export default function useLogin(){
    // Initialize Firebase Auth
    const auth = getAuth(app);

    const currentUser = auth.currentUser;

    // Stores the user's email input
    const [email, setEmail] = useState<string>('');

    // Stores the user's password input
    const [password, setPassword] = useState<string>('');

    // Stores backend validation error messages
    const [error, setError] = useState<Error[] | null>([]);

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

    /**
         * Attempts to log the user in
         * ---------------------------
         * 1. Sends credentials to backend for validation
         * 2. If valid, signs user into Firebase Auth
         * 3. Confirms email is verified
         * 4. Redirects user on success
         */
        async function loginAttempt(email: string, password: string) {
            setLoginError('');
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
                    setError(loginResponse.errors);
                    console.log(error);
                }
                else {
                    try {
                        setError(null);
                        // Attempt Firebase login
                        await signInWithEmailAndPassword(auth, email, password);
    
                        // Block login if email is not verified
                        if (!auth.currentUser?.emailVerified) {
                            try {
                                // Immediately sign user out
                                await signOut(auth);
                                setLoginError('Verify email to log in');
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
                        setLoginError("Invalid Email/Password");
                    }
                }
            }
            catch (error) {
                // Network or server error
                console.error(error);
            }
        }
    const loginHook: LoginHook = {
        currentUser: currentUser,
        email: email,
        password: password,
        error: error,
        loginError: loginError,
        redirect,
        handleEmailValue,
        handlePasswordValue,
        loginAttempt
    };

    return loginHook;
}