import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, } from "firebase/auth";
import { app } from "../firebase/firebase";

/**
* Payload sent to the backend signup endpoint.
*/
interface SignupData {
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
interface SignupHook {
    email: string;
    password: string;
    error?: Error[] | undefined;
    signupError: string;
    redirect: NavigateFunction;
    handleEmailValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handlePasswordValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    signupAttempt: (email: string, password: string) => Promise<void>;
}

export default function useSignUp(){
    
    /**
     * Signup Component
     *
     * Handles user account creation.
     *
     * Flow:
     * 1. Collect email and password from the user
     * 2. Send credentials to backend for validation
     * 3. Create Firebase authentication user
     * 4. Send email verification link
     * 5. Redirect user to the login page
     *
     * @component
     * @returns {JSX.Element} Signup form UI
     */

    /** User-entered email address */
    const [email, setEmail] = useState<string>("");

    /** User-entered password */
    const [password, setPassword] = useState<string>("");

    /** Error message returned from the backend */
    const [error, setError] = useState<Error[] | undefined>([]);

    /** Firebase authentication error */
    const [signupError, setSignupError] = useState<string>('');


    /** Navigation helper for redirecting after successful signup */
    const redirect = useNavigate();

    /**
     * Updates email state when the email input changes.
     */
    function handleEmailValue(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    /**
     * Updates password state when the password input changes.
     */
    function handlePasswordValue(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    /**
     * Attempts to create a new user account.
     *
     * - Validates input via backend API
     * - Creates Firebase auth user on success
     * - Sends email verification
     * - Redirects to login page
     *
     * @param {string} email - User email
     * @param {string} password - User password
     */
    async function signupAttempt(email: string, password: string) {
        const signupData: SignupData = {
            email,
            password,
        };
            setSignupError('');
            setError(undefined);
        try {
            const signupRequest = await fetch(
                `http://localhost:3000/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(signupData),
                }
            );

            const signupResponse = await signupRequest.json();

            if (Object.hasOwn(signupResponse, "errors")) {
                setError(signupResponse.errors);
            } else {
                try {
                    const auth = getAuth(app);
                    const userCredential =
                        await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );
                    
                    //sign user out right away upon successful login, enforces email validation requirement to log in
                    try{
                        signOut(auth);
                    }
                    catch(error){
                        console.error(error);
                    }

                    const user = userCredential.user;

                    // Send email verification link
                    try {
                        await sendEmailVerification(user);
                    } 
                    catch (error) {
                        console.error(
                            "Failed to send verification email:",
                            error
                        );
                    }

                    // Redirect to login page
                    redirect("/");
                } 
                catch (error) {
                    console.error(
                        "Firebase signup failed:",
                        error,
                    );
                    if(String(error).includes("Password")){
                        setSignupError("Password should contain at least 6 characters");
                    }
                    else{
                        setSignupError("Email already in use");
                    }
                }
            }
        } catch (error) {
            console.error("Signup request failed:", error);
        }
    }

    const signupHook: SignupHook = {
        email: email,
        password: password,
        error: error,
        signupError: signupError,
        redirect,
        handleEmailValue,
        handlePasswordValue,
        signupAttempt
    }

    return signupHook;
}
