import { useState } from 'react';
import styles from '../pages/pages_css/signup.module.css'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase/firebase';

interface SignupData{
    email: string;
    password: string;
}

export default function Signup(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState();

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
            if(Object.hasOwn(signupResponse, 'errors')){
                setError(signupResponse.errors[0].msg.replaceAll('value', signupResponse.errors[0].path));
            }

            else{
                const auth = getAuth(app);
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    console.log(user);
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    // ..
                });
            }
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
            <span>{error !== undefined ? `${error}` : null}</span>
        </div>    
    )
}