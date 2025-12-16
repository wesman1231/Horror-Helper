import styles from '../UI-Elements/UI_css/moviePageError.module.css';

interface errorMessage{
    errorMessage: string;
}

export default function MovieShowPageError(props: errorMessage){
    return(
        <h2 className={styles.error} >{props.errorMessage}</h2>
    );
}