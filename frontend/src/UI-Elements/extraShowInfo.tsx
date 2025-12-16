import type { Show } from "./tvCard"
import styles from '../UI-Elements/UI_css/extraShowInfo.module.css';

interface showProps{
    showData: Show | null;
}

export default function ExtraShowInfo(props: showProps){
    return(
        <section className={styles.showWrapper}>
            <h3 className={styles.tagsHeader}>Tags:</h3>
            <p className={styles.tags}>{props.showData?.keywords}</p>
            <h3 className={styles.creatorHeader}>Created By:</h3>
            <p className={styles.creator}>{props.showData?.creator}</p>
            <h3 className={styles.synopsisHeader}>Synopsis:</h3>
            <p className={styles.synopsis}>{props.showData?.synopsis}</p>
    </section>
    );
}