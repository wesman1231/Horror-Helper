import styles from '../UI-Elements/UI_css/loginError.module.css';

interface LoginErrorProps {
  loginError: string;
}

export default function LoginError(props: LoginErrorProps){

    return(
        <p role="alert" className={styles.error}>{props.loginError}</p>
    )
}