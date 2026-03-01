interface LoadMoreProps {
  isVisible: boolean;
  onLoadMore: () => void;
}

export default function LoadMoreButton({ isVisible, onLoadMore }: LoadMoreProps){
  if (!isVisible) return null;

  return (
    <button 
      type="button" 
      onClick={onLoadMore}
    >
      Load more
    </button>
  );
};