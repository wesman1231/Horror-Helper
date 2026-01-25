import type { Error } from "../hooks/useSignup";
import styles from '../UI-Elements/UI_css/inputValidationError.module.css';

interface ValidationError{
    inputError: Error[] | null;
}

export default function InputValidationError(props: ValidationError){
    
        return(
            <ul className={styles.errorsList}>
                {props.inputError?.map((error: Error) => 
                    <li key={error.msg} className={styles.error}>{`${error.msg}`}</li>
                )}
            </ul>
        )
        
}