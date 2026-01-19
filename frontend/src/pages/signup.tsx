import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../pages/pages_css/signup.module.css";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { app } from "../firebase/firebase";

/**
 * Payload sent to the backend signup endpoint.
 */
interface SignupData {
    email: string;
    password: string;
}

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
export default function Signup() {
    /** User-entered email address */
    const [email, setEmail] = useState<string>("");

    /** User-entered password */
    const [password, setPassword] = useState<string>("");

    /** Error message returned from the backend or Firebase */
    const [error, setError] = useState<string | undefined>();

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

            // Backend validation error TODO: UPDATE TO MATCH SIGNUP LOGIC RENDERING THE ERROR MESSAGES FROM THE ERRORS ARRAY AS AN UNORDERED LIST
            if (Object.hasOwn(signupResponse, "errors")) {
                setError(
                    signupResponse.errors[0].msg.replaceAll(
                        "value",
                        signupResponse.errors[0].path
                    )
                );
            } else {
                try {
                    const auth = getAuth(app);
                    const userCredential =
                        await createUserWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );

                    const user = userCredential.user;

                    // Send email verification link
                    try {
                        await sendEmailVerification(user);
                    } catch (error) {
                        console.error(
                            "Failed to send verification email:",
                            error
                        );
                    }

                    // Redirect to login page
                    redirect("/");
                } catch (error) {
                    console.error(
                        "Firebase signup failed:",
                        error
                    );
                }
            }
        } catch (error) {
            console.error("Signup request failed:", error);
        }
    }

    return (
        <div className={styles.signupWrapper}>
            <label htmlFor="Email">Email:</label>
            <input
                id="Email"
                type="Email"
                name="Email"
                autoComplete="True"
                onChange={handleEmailValue}
                required
            />

            <label htmlFor="Password">Password:</label>
            <input
                id="Password"
                type="Password"
                name="Password"
                onChange={handlePasswordValue}
                required
            />

            <button
                type="button"
                className={styles.signupButton}
                onClick={() => signupAttempt(email, password)}
            >
                Sign Up
            </button>

            {/* Error message display */}
            <span>{error !== undefined ? error : null}</span>
        </div>
    );
}
