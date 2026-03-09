import styles from './UI_css/loadMoreButton.module.css';

interface LoadMoreProps {
  isVisible: boolean;
  onLoadMore: () => void;
}

export default function LoadMoreButton({ isVisible, onLoadMore }: LoadMoreProps){
  if (!isVisible) return null;

  return (
    <button
      className={styles.loadMoreButton} 
      type="button" 
      onClick={onLoadMore}
    >
      Load more
    </button>
  );
};