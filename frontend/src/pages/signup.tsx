import styles from "../pages/pages_css/signup.module.css";


/**
 * Signup Component
 * * Provides a user interface for creating a new account. It handles the collection
 * of user credentials (email/password) and displays validation or authentication 
 * errors returned by the custom signup logic.
 * * @description
 * This component acts as a "View" that consumes the `useSignUp` hook.
 * It performs the following:
 * - Renders a controlled form for email and password.
 * - Displays a list of field-level validation errors from the backend.
 * - Displays global authentication errors (e.g., "Email already in use").
 * - Triggers the signup workflow on button click.
 * * @component
 * @returns {JSX.Element} The rendered signup form wrapper and its child elements.
 */
export default function Signup(){
    /** * Custom hook containing state management, input handlers, 
     * and the Firebase/Backend submission logic.
     */

    return (
        <div className={styles.pageContainer}>
            
            {/* Wrapper for signup component */}
            <div className={styles.signupWrapper}>
                <label htmlFor="Email">Email:</label>
                <input
                    id="Email"
                    type="Email"
                    name="Email"
                    autoComplete="True"
                    required
                />

                <label htmlFor="Password">Password:</label>
                <input
                    id="Password"
                    type="Password"
                    name="Password"
                    required
                />

                <button
                    type="button"
                    className={styles.signupButton}
                >
                    Sign Up
                </button>

                {/* Error message display */}


                {/* Display firebase signup error (email already in use) */}

            </div>
        </div>
    );
}