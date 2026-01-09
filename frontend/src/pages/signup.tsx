import styles from '../pages/pages_css/signup.module.css'

export default function Signup(){

    return(
        <div className={styles.signupWrapper}>
            <label htmlFor="email">Email: </label>
            <input type="email" name="email"></input>
            <label htmlFor="password">Password: </label>
            <input type="password" name="password"></input>
            <button type='button' className={styles.signupButton}>Sign Up</button>
        </div>    
    )
}