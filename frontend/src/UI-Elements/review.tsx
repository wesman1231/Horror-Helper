import { useState } from "react";
import styles from './UI_css/review.module.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function Review(){
    const { user } = useAuth0();
    const [score, setScore] = useState<number>(0);
    const [reviewValue, setReviewValue] = useState<string>('');
    const [highlight, setHighlight] = useState<number>();
    
    const userID = user?.sub;

    interface Review{
        userID: string | undefined,
        reviewScore: number
        revieText: string 
    }

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>){
        setReviewValue(event.target.value);
    }

    function selectScore(rating: number){
        setScore(rating);
        setHighlight(rating);
    }


    async function postReview(){
        const reviewInfo: Review = {
            userID: userID,
            reviewScore: score,
            revieText: reviewValue
        };

        await fetch('http://localhost:3000/api/movies/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({reviewInfo: reviewInfo})
        });
    }

    return(
        <div className={styles.reviewContainer}>
            <div className={styles.reviewScoreContainer}>
                <span>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                            key={num}
                            type='button' 
                            className={`${styles.reviewScoreButton} ${num <= (highlight ?? 0) ? styles.active : styles.inactive}`}
                            onClick={() => selectScore(num)}
                        />
                    ))}
                </span>
            </div>
            <textarea name='review' id='review' rows={10} cols={50} value={reviewValue} onChange={handleInput} ></textarea>
            <button type='button' onClick={() => postReview}>submit review</button>
        </div>
    );
}