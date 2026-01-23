import styles from "../pages/pages_css/signup.module.css";

//import signup hook
import useSignUp from "../hooks/useSignup";

//import input validation error interface from signup ghook
import type { Error } from "../hooks/useSignup";

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
    const signupLogic = useSignUp();

    return (
        <div className={styles.signupWrapper}>
            <label htmlFor="Email">Email:</label>
            <input
                id="Email"
                type="Email"
                name="Email"
                autoComplete="True"
                onChange={signupLogic.handleEmailValue}
                required
            />

            <label htmlFor="Password">Password:</label>
            <input
                id="Password"
                type="Password"
                name="Password"
                onChange={signupLogic.handlePasswordValue}
                required
            />

            <button
                type="button"
                className={styles.signupButton}
                onClick={() => signupLogic.signupAttempt(signupLogic.email, signupLogic.password)}
            >
                Sign Up
            </button>

            {/* Error message display */}
            {signupLogic.error !== undefined
            ? <ul className={styles.errorList}>
                {signupLogic.error?.map((error: Error) =>
                    <li key={error.msg} className={styles.error}>
                        {`${error.msg}`}
                    </li>
                )}
              </ul>
            : null}

            {/* Display firebase signup error (email already in use) */}
            {signupLogic.signupError !== ''
            ? <span key={signupLogic.signupError} className={styles.error}>{`${signupLogic.signupError}`}</span>
            : null}
        </div>
    );
}