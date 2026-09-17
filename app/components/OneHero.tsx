import styles from "./OneHero.module.css";

export default function OneHero() {
  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>YAHSHUA One</p>
      <h1>Your whole business.<br className={styles.mobileBreak} /> <span>One place.</span></h1>
      <p className={styles.intro}>Bring your people, finances, and operations together.<br className={styles.desktopBreak} /> Use AI to turn business questions into your next move.</p>
      <div className={styles.actions}>
        <a href="#waitlist" className={styles.primary}>Join the waitlist <span aria-hidden="true">↗</span></a>
        <a href="#platform" className={styles.secondary}>See One in action <span aria-hidden="true">↓</span></a>
      </div>
      <p className={styles.note}>Be first to hear when early access opens.</p>
    </div>
  );
}
