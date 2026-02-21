import { useState } from "react";
import type { mediaType } from "../pages/mediaSearch";
import styles from './UI_css/review.module.css';
import { useAuth0 } from "@auth0/auth0-react";


interface ReviewProps{
    mediaID: number | undefined,
    mediaType: mediaType,
    userID?: string;
    username: string
}

export default function Review(props: ReviewProps){
    const { getAccessTokenSilently  } = useAuth0();
    const [score, setScore] = useState<number>(0);
    const [reviewValue, setReviewValue] = useState<string>('');
    const [highlight, setHighlight] = useState<number>(0);
    const [scoreError, setScoreError] = useState<string>('');

    

    interface Review{
        userID: string | undefined,
        userName: string | undefined
        reviewScore: number
        reviewText: string,
        mediaType: mediaType
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
            userID: props.userID,
            userName: props.username,
            reviewScore: score,
            reviewText: reviewValue,
            mediaType: 'movies'
        };

        if(score === 0){
            setScoreError('Score cannot be 0');
            return null;
        }

        const token = await getAccessTokenSilently();

        const request = await fetch(`http://localhost:3000/api/reviews/post?mediaID=${props.mediaID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({reviewInfo: reviewInfo})
        });

        const result = await request.json();
        console.log(result);
    }

    return(
        <div className={styles.reviewContainer}>
            {scoreError !== '' ? <span>{scoreError}</span> : null}
            <div className={styles.reviewScoreContainer}>
                <span>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                            key={num}
                            type='button' 
                            className={`${styles.reviewScoreButton} ${num <= (highlight) ? styles.active : styles.inactive}`}
                            onClick={() => selectScore(num)}
                        />
                    ))}
                </span>
            </div>
            <textarea name='review' id='review' rows={10} cols={50} value={reviewValue} onChange={handleInput} ></textarea>
            <button type='button' onClick={postReview}>submit review</button>
        </div>
    );
}