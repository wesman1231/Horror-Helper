import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../pages/pages_css/signup.module.css'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { app } from '../firebase/firebase';

interface SignupData{
    email: string;
    password: string;
}

export default function Signup(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState();
    const redirect = useNavigate();

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
                try{
                    const auth = getAuth(app);
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    try{
                        await sendEmailVerification(user); //send email verification link
                    }
                    catch(error){
                        console.error(error);
                    }
                    
                    redirect('/'); //redirect to login page  
                }
                catch(error){
                    console.error(error);
                }
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