import styles from '../pages/pages_css/forgotPassword.module.css';
import { useState } from 'react';

export default function ForgotPassword(){
    const [email, setEmail] = useState<string>('');

    function handleEmailInput(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }


    return(
        <div className={styles.forgotPasswordWrapper}>
            <span>Enter email </span>
            <label htmlFor="Email">
                Email:
            </label>
            <input id="Email" name="Email" type="Email" autoComplete="true" onChange={handleEmailInput}></input>
            <button type="button" className={styles.button} >reset password</button>
        </div>
    )
}