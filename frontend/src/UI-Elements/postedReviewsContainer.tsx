import styles from './UI_css/postedReviewsContainer.module.css';
import type { mediaType } from '../pages/mediaSearch';
import { useEffect, useState } from 'react';
import PostedReview from './postedReview';

interface ReviewContainerProps{
    mediaID?: number;
    mediaType: mediaType;
    username: string;
    userID?: string;
}



export default function PostedreviewsContainer(props: ReviewContainerProps){
    interface Review {
        username: string;
        reviewScore: number;
        reviewText: string;
        userID?: number;
    }
    
    const [reviews, setReviews] = useState<Review[]>([]);
    

    useEffect(() => {
        async function getReviews(){
            try{
                const fetchReviews = await fetch(`http://localhost:3000/api/reviews/get?mediaID=${props.mediaID}&mediaType=${props.mediaType}`);
                const reviewsJSON = await fetchReviews.json();
                console.log(reviewsJSON);
                console.log(props.mediaID);
                console.log(props.mediaType);
                setReviews(reviewsJSON.reviews);
            }
            catch(error){
                console.error(error);
            }
        }
        
        getReviews();
    }, [props.mediaID]);


    return(
        <div className={styles.postedReviewsContainer}>
            <ul>
                {reviews.length > 0 
                ?   reviews.map((review) => 
                    <PostedReview key={review.userID} username={props.username} userID={props.userID} reviewScore={review.reviewScore} reviewText={review.reviewText}/>
                )
                :null}
            </ul>
        </div>
    )
}