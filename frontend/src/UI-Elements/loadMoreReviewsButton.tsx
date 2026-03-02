import type { mediaType } from "../pages/mediaSearch";

interface LoadMoreProps {
  isVisible: boolean;
  setPage: (page: number) => void;
  onLoadMore: (mediaID: number | undefined, mediaType: mediaType, page: number) => Promise<void>;
}

export default function LoadMoreReviewsButton(props: LoadMoreProps){
    return(
        <button type='button' onClick={() => props.onLoadMore}></button>
    )
}