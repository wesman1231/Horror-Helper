import type { Error } from "../hooks/useSignup";
import styles from '../UI-Elements/UI_css/inputValidationError.module.css';

interface SignupErrorProps{
    inputError: Error[];
}

export default function InputValidationError(props: SignupErrorProps){
    
        return(
            <ul className={styles.errorsList}>
                {props.inputError?.map((error: Error) => 
                    <li key={error.msg} className={styles.error}>{`${error.msg}`}</li>
                )}
            </ul>
        )
        
}