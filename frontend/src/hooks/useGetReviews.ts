// Import React's useState hook to manage local component state
import { useState } from "react";

// Import a custom TypeScript type that represents the type of media (e.g., movie, TV show, etc.)
import type { mediaType } from "../pages/mediaSearch";

// Define a TypeScript interface describing the shape of a single review object
export interface Review {
    username: string;       // The name of the user who wrote the review
    reviewScore: number;    // Numerical rating given by the user
    reviewText: string;     // The written review content
    userID?: string;        // user ID
}

// Custom React Hook for fetching and storing reviews
export default function useGetReviews() {

    // Create state to store an array of reviews
    // Initially set to an empty array
    const [reviews, setReviews] = useState<Review[]>([]);
        
    /**
     * Fetch reviews from the backend API
     * @param mediaID - The ID of the media item (movie, show, etc.)
     * @param mediaType - The type/category of the media
     */
    async function getReviews(mediaID: number | undefined, mediaType: mediaType) {
        try {
            // Send a GET request to the backend with mediaID and mediaType as query parameters
            const fetchReviews = await fetch(
                `http://localhost:3000/api/reviews/get?mediaID=${mediaID}&mediaType=${mediaType}`
            );

            // Parse the JSON response body
            const reviewsJSON = await fetchReviews.json();

            // Log the response to the console for debugging purposes
            console.log(reviewsJSON);

            // Update the reviews state with the reviews returned from the API
            // Assumes the API response structure looks like:
            // { reviews: [...] }
            setReviews(reviewsJSON.reviews);
        }
        catch (error) {
            // Catch and log any errors that occur during the fetch process
            console.error(error);
        }
    }

    // Return the reviews state and the getReviews function
    // This allows components that use this hook to:
    // 1. Access the current list of reviews
    // 2. Call getReviews() to fetch new reviews
    return {
        reviews: reviews,
        getReviews
    }
}