import styles from '../pages/pages_css/resendVerificationEmail.module.css';
import { useState } from 'react';

/**
 * ResendEmailVerification Component
 *
 * Allows a user to request a new Auth0 email verification link.
 * The user enters their email address, which is sent to the backend
 * endpoint responsible for triggering the verification email.
 */
export default function ResendEmailVerification() {
  // Stores the user's email input
  const [email, setEmail] = useState<string>('');

  // Stores success or error messages shown to the user
  const [resendEmailStatus, setResendEmailStatus] = useState<string>('');

  /**
   * Handles changes to the email input field
   * and updates component state.
   */
  function handleEmailInput(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  /**
   * Sends a request to the backend to resend
   * the verification email for the given address.
   */
  async function resendVerification() {
    try {
      // Send POST request to backend API
      const requestResend = await fetch(
        'http://localhost:3000/api/resend-verification',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const response = await requestResend.json();

      // Handle successful response
      if (requestResend.ok) {
        setResendEmailStatus(response.message);
        return;
      }

      // Handle API-level errors
      console.error(response.error);
      setResendEmailStatus(response.error ?? 'Failed to resend verification email');
    } catch (error) {
      // Handle network or unexpected errors
      setResendEmailStatus(String(error));
    }
  }

  return (
    <div className={styles.pageContainer}>
        <div className={styles.resendVerificationWrapper}>
            <span>Enter email</span>

            <label htmlFor="Email">Email:</label>

            <input
                id="Email"
                name="Email"
                type="email"
                autoComplete="email"
                onChange={handleEmailInput}
            />

            <button
                type="button"
                className={styles.button}
                onClick={resendVerification}
            >
                Resend verification email
            </button>

            {/* Status message shown after request */}
            <p className={styles.verificationError}>{resendEmailStatus}</p>
        </div>
    </div>
  );
}
