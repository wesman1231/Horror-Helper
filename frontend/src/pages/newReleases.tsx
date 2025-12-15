import styles from '../pages/pages_css/newReleases.module.css'

export default function NewReleases(){
    const currentDate: Date = new Date();    
    
    return(
        <>
            <h2 className={styles.headerText}>New Releases For{` ${currentDate.getFullYear()}`}</h2>
        </>
    )
}