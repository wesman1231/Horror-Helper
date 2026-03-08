// React state hook
import { useState } from "react";

import type { Movie } from "./movieCard";

import type { Show } from "./tvCard";

// Type for media category (movies or shows)
import type { mediaType } from "../pages/mediaSearch";

import type { Review } from "../hooks/useReviews";

// CSS module for styling this component
import styles from './UI_css/createReview.module.css';

// Props that this component expects
interface CreateReviewProps {
    mediaData: Movie | Show | null,
    mediaType: mediaType,
    username?: string,
    userID?: string,
    token: string
    postReview: (mediaID: number | undefined, mediaType: mediaType, review: Review) => Promise<void>;
}

export default function CreateReview(props: CreateReviewProps) {
    // Local state for selected review score (1–5)
    const [score, setScore] = useState<number>(1);

    // Local state for review text input
    const [reviewValue, setReviewValue] = useState<string>('');

    // Controls star/button highlight effect
    const [highlight, setHighlight] = useState<number>(1);

    const [reviewTextError, setReviewTextError] = useState(false);

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

    async function submitReview(){
        if(reviewValue === ''){
            setReviewTextError(true);
        }
        else{
            const reviewData: Review = {
                username: props.username,
                userID: props.userID,
                reviewScore: score,
                reviewText: reviewValue,
                mediaID: props.mediaData?.tmdbid,
                token: props.token,
                mediaType: 'movies',
                reviewID: crypto.randomUUID(),
                dateTime: new Date().toLocaleString()
            };
            await props.postReview(props.mediaData?.tmdbid, props.mediaType, reviewData);
            setReviewValue('');
            setScore(1); 
            setHighlight(1);
            setReviewTextError(false);
        }
    }

    return (
        <div className={styles.reviewContainer}>
            <span className={styles.scoreText}>How many skulls out of 5 would you give?</span>
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
            
            {reviewTextError ? 
            <span className={styles.reviewTextRequired}>This field is required</span>
            : 
            null}

            {/* Text area for writing review */}
            <textarea
                name='review'
                id='review'
                rows={10}
                cols={50}
                maxLength={1000}
                value={reviewValue}
                onChange={handleInput}
                className={styles.reviewTextBox}
            />

            {/* Submit button */}
            <button type='button' className={styles.submitReviewButton} onClick={() => submitReview()}>
                submit review
            </button>
        </div>
    );
}