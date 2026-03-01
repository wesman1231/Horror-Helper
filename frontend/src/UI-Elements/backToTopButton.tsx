import styles from './UI_css/backToTopButton.module.css';

interface ScrollToTopProps {
    isVisible: boolean;
}

export default function ScrollToTopButton({ isVisible }: ScrollToTopProps){
    if (!isVisible) return null;

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button 
            className={styles.scrollToTopButton}
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
        >
         Back to top
        </button>
    );
};