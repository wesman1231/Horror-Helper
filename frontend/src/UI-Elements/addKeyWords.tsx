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
    return (
        <div className={styles.keywordsWrapper}>
            <ul className={styles.keywordsList}>
                <li>
                    <input
                        type="checkbox"
                        value="slasher"
                        onChange={props.handleCheckboxChange}
                    />
                    slasher
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="ghost"
                        onChange={props.handleCheckboxChange}
                    />
                    ghost
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="sequel"
                        onChange={props.handleCheckboxChange}
                    />
                    sequel
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="sci-fi horror"
                        onChange={props.handleCheckboxChange}
                    />
                    sci-fi horror
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="found footage"
                        onChange={props.handleCheckboxChange}
                    />
                    found footage
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="vampire"
                        onChange={props.handleCheckboxChange}
                    />
                    vampire
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="zombie"
                        onChange={props.handleCheckboxChange}
                    />
                    zombie
                </li>
                <li>
                    <input
                        type="checkbox"
                        value="werewolf"
                        onChange={props.handleCheckboxChange}
                    />
                    werewolf
                </li>
            </ul>
        </div>
    );
}
