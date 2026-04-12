import styles from "../UI-Elements/UI_css/addKeyWords.module.css";

/**
 * Props for the AddKeywords component.
 */
interface KeywordsProps {
    /**
     * Handler function triggered when a checkbox value changes.
     * Used by the parent component to manage selected keywords.
     */
    handleCheckboxChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
        keywordsOpen: boolean;
        onAnimationEnd: () => void;
}

/**
 * AddKeywords Component
 *
 * Renders a predefined list of keyword checkboxes that can be
 * attached to a movie or show.
 *
 * This component is fully controlled by its parent via the
 * `handleCheckboxChange` callback.
 *
 * Keywords include:
 * - Slasher
 * - Ghost
 * - Sequel
 * - Sci-fi horror
 * - Found footage
 * - Vampire
 * - Zombie
 * - Werewolf
 *
 * @component
 * @param {KeywordsProps} props - Component props
 * @returns {JSX.Element} Keyword selection UI
 */
export default function AddKeywords(props: KeywordsProps) {
    const keywordsList: string[] = ['1940s', '1950s', '1960s', '1970s', '1980s', '2000s', 'alien', 'anthology', 'b movie', 'black and white', 'body horror', 'cabin', 'cannibal', 'christmas', 'comedy', 
        'cosmic horror', 'creature', 'cult', 'demonic posession', 'dystopia', 'erotic thriller', 'exorcism', 'exploitation', 'family drama', 'farm', 'folk horror', 'forest', 'found footage', 'ghost', 'giallo', 
        'giant cockroach', 'giant crocodile', 'giant insect', 'giant monster', 'giant snake', 'giant spider', 'gore', 'gothic', 'grief', 'halloween', 'haunted house', 'hell', 'holiday', 'home invasion', 
        'independent film', 'indie horror', 'infection', 'internet', 'investigation', 'isolation', 'italian', 'kaiju', 'kidnapping', 'killer', 'killer ape', 'killer bees', 'killer car', 'killer cat',
        'killer child', 'killer clown', 'killer dog', 'killer doll', 'killer robot', 'lgtb', 'mask', 'mockumentary', 'monster', 'mummy', 'musical', 'ouija board', 'parody', 'playful', 'post-apocalyptic', 'priest',
        'proto-slasher', 'psychological', 'puppet', 'religion', 'remake', 'ridiculous', 'romance', 'sea monster', 'sequel', 'shark', 'short film', 'skeleton', 'small town', 'snake', 'space', 'splatter', 
        'supernatural', 'surreal', 'suspense', 'torture', 'vampire', 'werewolf', 'zombie'];

    return (
        <div className={styles.keywordsWrapper}>
            <ul className={props.keywordsOpen ? styles.keywordsList : styles.keywordsListReverse} onAnimationEnd={props.onAnimationEnd}>
                <h2>Keywords</h2>
                {keywordsList.map((keyword) => (
                    <li key={keyword}>
                        <label>
                            <input
                                type="checkbox"
                                value={keyword}
                                onChange={props.handleCheckboxChange}
                            />
                            <span className={styles.keywordText}>{keyword}</span>
                        </label>
                    </li>
                ))}
            </ul>
            {props.keywordsOpen ? 
            <div className={styles.bloodDropContainer}>
                <div className={styles.bloodDrop1}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop2}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop3}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop4}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop5}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop6}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop7}>
                    <div className={styles.sheen}></div>
                </div>
                <div className={styles.bloodDrop8}>
                    <div className={styles.sheen}></div>
                </div>
            </div> : 
            null}
        </div>
    );
}
