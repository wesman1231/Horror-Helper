// Import CSS module for styling
import styles from './UI_css/postedReview.module.css';

// Define props expected by this component
interface PostedReviewProps {
    username: string;        // Name of the user who wrote the review
    reviewText: string;      // The written review content
    reviewScore: number;     // Numeric rating (e.g., 1–5)
    userID?: string;         // user ID
}

// Functional component responsible for rendering a single review
export default function PostedReview(props: PostedReviewProps) {

    // Create an array that will represent the score visually
    // Example: if reviewScore = 3 → [1, 2, 3]
    const scoreArray = [];

    // Loop from 1 up to reviewScore and push numbers into the array
    for (let i = 1; i <= props.reviewScore; i++) {
        scoreArray.push(i);
    }

    return (
        <div className={styles.reviewContainer}>

            {/* Display username */}
            <span className={styles.username}>
                {props.username}
            </span>

            {/* Display review text */}
            <p className={styles.reviewText}>
                {props.reviewText}
            </p>

            {/* Display visual score (images based on rating) */}
            <div className={styles.scoreContainer}>
                {scoreArray.map((num) =>
                    <img
                        key={num} // Required for React list rendering
                        src='/buttonImages/20241116_001.png'
                        width={20}
                        height={30}
                    />
                )}
            </div>

        </div>
    );
}