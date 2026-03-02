// Import React's useState hook to manage local component state
import { useState } from "react";

// Import a custom TypeScript type that represents the type of media (e.g., movie, TV show, etc.)
import type { mediaType } from "../pages/mediaSearch";

// Define a TypeScript interface describing the shape of a single review object
export interface Review {
    username?: string;       // The name of the user who wrote the review
    userID?: string;        // user ID
    reviewScore: number;    // Numerical rating given by the user
    reviewText: string;     // The written review content
    mediaID?: number,         // ID of the movie or show
    token: string, 
    mediaType: mediaType,
    reviewID: string;
}

// Custom React Hook for fetching and storing reviews
export default function useReviews() {

    // Create state to store an array of reviews
    // Initially set to an empty array
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    

    /**
     * Fetch reviews from the backend API
     * @param mediaID - The ID of the media item (movie, show, etc.)
     * @param mediaType - The type/category of the media
     */
    async function getReviews(mediaID: number | undefined, mediaType: mediaType, page: number) {
        try {
            // Send a GET request to the backend with mediaID and mediaType as query parameters
            const fetchReviews = await fetch(
                `http://localhost:3000/api/reviews/get?mediaID=${mediaID}&mediaType=${mediaType}&page=${page}`
            );

            // Parse the JSON response body
            const reviewsJSON = await fetchReviews.json();

            console.log(mediaID);
            console.log(page);
            // Log the response to the console for debugging purposes
            console.log(reviewsJSON);

            if (reviewsJSON.reviews) {
            // ALWAYS use the spread operator to keep the list flat
            setReviews(reviewsJSON.reviews);
            setTotalPages(reviewsJSON.numberOfPages);
        }
            setTotalPages(reviewsJSON.numberOfPages);
        }
        catch (error) {
            // Catch and log any errors that occur during the fetch process
            console.error(error);
        }
    }



    async function postReview(mediaID: number | undefined, mediaType: mediaType, review: Review){
        try{
            // Send POST request to backend with authorization header
            await fetch(`http://localhost:3000/api/reviews/post?mediaID=${mediaID}&mediaType=${mediaType}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${review.token}`
                    },
                    body: JSON.stringify({ reviewData: review })
                }
            );
        }
        catch(error){
            console.error(error);
        }
    }



    // Return the reviews state and the getReviews function
    // This allows components that use this hook to:
    // 1. Access the current list of reviews
    // 2. Call getReviews() to fetch new reviews
    return {
        reviews: reviews,
        totalPages: totalPages,
        getReviews,
        postReview
    }
}