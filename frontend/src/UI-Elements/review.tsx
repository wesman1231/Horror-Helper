import { useState } from "react";
import styles from './UI_css/review.module.css';
import { useAuth0 } from '@auth0/auth0-react';

export default function Review(){
    const { user } = useAuth0();
    
    const userID = user?.sub;

    interface Review{
        userID: string | undefined,
        revieText: string 
    }

    const [reviewValue, setReviewValue] = useState<string>('');

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>){
        setReviewValue(event.target.value);
    }

    async function postReview(){
        const reviewInfo: Review = {
            userID: userID,
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
            <textarea name='review' id='review' rows={10} cols={50} value={reviewValue} onChange={handleInput} ></textarea>
            <button type='button' onClick={() => postReview}>submit review</button>
        </div>
    );
}