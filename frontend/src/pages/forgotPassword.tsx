import styles from '../pages/pages_css/forgotPassword.module.css';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth/cordova';
import { app } from '../firebase/firebase';
import { useState } from 'react';

export default function ForgotPassword(){
    const [email, setEmail] = useState<string>('');

    function handleEmailInput(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }

    async function sendPasswordReset(email: string){
        const auth = getAuth(app);

        try{
            await sendPasswordResetEmail(auth, email);
        }
        catch(error){
            console.error(error);
        }
    }

    return(
        <div className={styles.forgotPasswordWrapper}>
            <span>Enter email </span>
            <label htmlFor="Email">
                Email:
            </label>
            <input id="Email" name="Email" type="Email" autoComplete="true" onChange={handleEmailInput}></input>
            <button type="button" className={styles.button} onClick={() => sendPasswordReset(email)}>reset password</button>
        </div>
    )
}