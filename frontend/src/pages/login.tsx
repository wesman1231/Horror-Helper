import { Link } from 'react-router';
import styles from '../pages/pages_css/login.module.css';
export default function Login(){
    

    return(
        <div className={styles.loginWrapper}>
            <label htmlFor="email">Email: </label>
            <input type="email" name="email"></input>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password"></input>
            <button type='button' className={styles.loginButton}>Log in</button>

            <span>Don't have an account? <Link to='/signup'>Sign up</Link></span>
        </div>    
    )
}