import { Link } from 'react-router';
import styles from '../pages/pages_css/login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { app } from '../firebase/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

interface LoginData{
    email: string;
    password: string;
}

export default function Login(){
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState();
    const [loginError, setLoginError] = useState<string>('');
    const redirect = useNavigate();
    

    function handleEmailValue(event: React.ChangeEvent<HTMLInputElement>){
        setEmail(event.target.value);
    }


    function handlePasswordValue(event: React.ChangeEvent<HTMLInputElement>){
        setPassword(event.target.value);
    }

    async function loginAttempt(email: string, password: string){
        const loginData: LoginData = {
            email: email,
            password: password
        }
        try{
            const loginRequest = await fetch(`http://localhost:3000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

            const loginResponse = await loginRequest.json();
            if(Object.hasOwn(loginResponse, 'errors')){
                    setError(loginResponse.errors[0].msg.replaceAll('value', loginResponse.errors[0].path));
            }
            else{
                const auth = getAuth(app);
                signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log(user);
                    redirect('/home');
                    // ...
                })
                .catch((error) => {
                    console.error(error);
                    const errorMessage = 'invalid credentials';
                    setLoginError(errorMessage);
                });
            }
        }
        catch(error){
            console.error(error);
        }
    }

        return(
            <div className={styles.loginWrapper}>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" onChange={handleEmailValue}></input>
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" onChange={handlePasswordValue}></input>
                <button type='button' className={styles.loginButton} onClick={() => loginAttempt(email, password)}>Log in</button>
                <span>{error !== undefined ? `${error}` : null}</span>
                <span>{loginError !== undefined ? `${loginError}` : null}</span>
                <span>Don't have an account? <Link to='/signup'>Sign up</Link></span>
            </div>    
        )
}
