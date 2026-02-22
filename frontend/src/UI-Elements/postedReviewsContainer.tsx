// Import CSS module for styling
import styles from './UI_css/postedReviewsContainer.module.css';

// Import child component that renders a single review
import PostedReview from './postedReview';

// Import the Review TypeScript interface
import type { Review } from '../hooks/useGetReviews';

// Define props expected by this component
interface PostedReviewContainerProps {
    reviews: Review[];  // Array of review objects to display
}

// Functional component that displays a list of posted reviews
export default function PostedreviewsContainer(props: PostedReviewContainerProps) {

    return (
        // Wrapper container for styling
        <div className={styles.postedReviewsContainer}>

            {/* Unordered list to contain review items */}
            <ul className={styles.reviewList}>

                {
                    // Only render reviews if array is not empty
                    props.reviews.length > 0

                        // If reviews exist, map over them and render PostedReview component
                        ? props.reviews.map((review) =>

                            <PostedReview
                                // React requires a unique "key" for list items
                                key={review.reviewText}

                                // Pass review data down as props to child component
                                username={review.username}
                                userID={review.userID}
                                reviewScore={review.reviewScore}
                                reviewText={review.reviewText}
                            />
                        )

                        // If no reviews exist, render nothing
                        : null
                }

            </ul>
        </div>
    );
}