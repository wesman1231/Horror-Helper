import styles from './UI_css/pentagramSpinner.module.css';

export default function PentagramSpinner({ size = 100 }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className={styles.svg}>
  {/* Outer Circle */}
  <circle
    cx="50"
    cy="50"
    r="45"
    className={styles.circle}
  />

  {/* Intersecting Pentagram */}
  <path
    d="
      M50,8 
      L76,90 
      L8,38 
      L92,38 
      L24,90 
      Z
    "
    className={styles.pentagram}
  />
</svg>
    </div>
  );
}