import styles from './UI_css/postedReview.module.css';

interface PostedReviewProps{
    username: string;
    reviewText: string;
    reviewScore: number;
    userID?: string;
}

export default function PostedReview(props: PostedReviewProps){

    return(
        <div className={styles.reviewContainer}>
            <span className={styles.username}>{props.username}</span>
            <p>{props.reviewText}</p>
        </div>
    )
}