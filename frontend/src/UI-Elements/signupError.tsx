import styles from '../UI-Elements/UI_css/signupError.module.css';

interface SignupErrorProps {
  signupError: string;
}

export default function SignupError(props: SignupErrorProps){

    return(
        <p role="alert" className={styles.error}>{props.signupError}</p>
    )
}