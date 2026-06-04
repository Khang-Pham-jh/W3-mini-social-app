import styles from './ModeSwitch.module.css';

function ModeSwitch({ mode, onSwitchMode }) {
  return (
    <div className={styles.modeSwitch} role="tablist" aria-label="Authentication mode">
      <button
        type="button"
        className={mode === 'login' ? styles.activeModeButton : styles.modeButton}
        onClick={() => onSwitchMode('login')}
        aria-selected={mode === 'login'}
      >
        Log in
      </button>
      <button
        type="button"
        className={mode === 'signup' ? styles.activeModeButton : styles.modeButton}
        onClick={() => onSwitchMode('signup')}
        aria-selected={mode === 'signup'}
      >
        Sign up
      </button>
    </div>
  );
}

export default ModeSwitch;
