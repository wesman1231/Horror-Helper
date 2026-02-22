// React state hook
import { useState } from "react";

// Type for media category (movies or shows)
import type { mediaType } from "../pages/mediaSearch";

// CSS module for styling this component
import styles from './UI_css/createReview.module.css';

// Auth0 hook for authentication & token access
import { useAuth0 } from "@auth0/auth0-react";

// Props that this component expects
interface CreateReviewProps {
    mediaID: number | undefined,   // ID of the media being reviewed
    mediaType: mediaType,          // Type of media (movies or shows)
    fetchReviews: {
        // Function passed down to refresh reviews after posting
        getReviews: (id: number | undefined, type: mediaType) => Promise<void>;
    };
}

export default function Review(props: CreateReviewProps) {

    // Get authenticated user info and token helper from Auth0
    const { user, getAccessTokenSilently } = useAuth0();

    // Local state for selected review score (1–5)
    const [score, setScore] = useState<number>(0);

    // Local state for review text input
    const [reviewValue, setReviewValue] = useState<string>('');

    // Controls star/button highlight effect
    const [highlight, setHighlight] = useState<number>(0);

    // Stores validation error for score
    const [scoreError, setScoreError] = useState<string>('');

    // Extract user ID from Auth0 user object
    const userID = user?.sub;

    // Extract custom username claim from Auth0 token
    const userName = user?.['https://horror-helper-backend/username'];

    // Interface describing the review object that will be sent to backend
    interface PostedReview {
        userID: string | undefined,
        userName: string | undefined
        reviewScore: number
        reviewText: string,
        mediaType: mediaType
    }

    /**
     * Updates review text as user types in textarea
     */
    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setReviewValue(event.target.value);
    }

    /**
     * Sets the selected rating score
     * Also updates highlight to visually reflect selection
     */
    function selectScore(rating: number) {
        setScore(rating);
        setHighlight(rating);
    }

    /**
     * Sends review to backend API
     */
    async function postReview() {

        // Construct review object to send
        const reviewInfo: PostedReview = {
            userID: userID,
            userName: userName,
            reviewScore: score,
            reviewText: reviewValue,
            mediaType: props.mediaType
        };

        // Prevent submission if no score selected
        if (score === 0) {
            setScoreError('Score cannot be 0');
            return null;
        }

        // Retrieve access token silently (Auth0)
        const token = await getAccessTokenSilently();

        // Send POST request to backend with authorization header
        const post = await fetch(
            `http://localhost:3000/api/reviews/post?mediaID=${props.mediaID}&mediaType=${props.mediaType}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reviewInfo: reviewInfo })
            }
        );

        // If successful, refresh the reviews list
        if (post.ok) {
            props.fetchReviews.getReviews(props.mediaID, props.mediaType);
        }
    }

    return (
        <div className={styles.reviewContainer}>

            {/* Display validation error if score is 0 */}
            {scoreError !== '' ? <span>{scoreError}</span> : null}

            {/* Rating buttons (1–5 stars style) */}
            <div className={styles.reviewScoreContainer}>
                <span>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            type='button'
                            className={`
                                ${styles.reviewScoreButton}
                                ${num <= highlight ? styles.active : styles.inactive}
                            `}
                            onClick={() => selectScore(num)}
                        />
                    ))}
                </span>
            </div>

            {/* Text area for writing review */}
            <textarea
                name='review'
                id='review'
                rows={10}
                cols={50}
                maxLength={1000}
                value={reviewValue}
                onChange={handleInput}
            />

            {/* Submit button */}
            <button type='button' onClick={postReview}>
                submit review
            </button>
        </div>
    );
}