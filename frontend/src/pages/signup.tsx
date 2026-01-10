import { useState } from 'react';
import styles from '../pages/pages_css/signup.module.css'

interface SignupData{
    email: string;
    password: string;
}

export default function Signup(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    function handleEmailValue(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }


    function handlePasswordValue(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }


    async function signupAttempt(email: string, password: string){
        const signupData: SignupData = {
            email: email,
            password: password
        }
        try{
            const signupRequest = await fetch(`http://localhost:3000/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });
            const signupResponse = await signupRequest.json();
            console.log(signupResponse);
        }
        catch(error){
            console.error(error);
        }
    }


    return(
        <div className={styles.signupWrapper}>
            <label htmlFor="email">Email: </label>
            <input type="email" name="email" onChange={handleEmailValue} required></input>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" onChange={handlePasswordValue} required></input>
            <button type='button' className={styles.signupButton} onClick={() => signupAttempt(email, password)}>Sign Up</button>
        </div>    
    )
}