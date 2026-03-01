import styles from './UI_css/emptyOrError.module.css'

// Empty State Component
interface EmptyStateProps {
  show: boolean;
}

export function EmptyState({ show }: EmptyStateProps){
  if (!show) return null;
  return <span className={styles.noResultsMessage}>No results found</span>;
};

// Error State Component
interface ErrorStateProps {
  message?: string;
  isError: boolean;
}

export function ErrorState({ message, isError }: ErrorStateProps){
  if (!isError || !message) return null;
  return <span className={styles.errorMessage}>{message}</span>;
};