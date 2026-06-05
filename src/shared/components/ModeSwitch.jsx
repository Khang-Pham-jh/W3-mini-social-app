import { AUTH_MODES } from '../constants/auth.js';
import styles from './ModeSwitch.module.css';

function ModeSwitch({ mode, onSwitchMode }) {
  return (
    <div className={styles.modeSwitch} aria-label="Authentication mode">
      <button
        type="button"
        className={mode === AUTH_MODES.LOGIN ? styles.activeModeButton : styles.modeButton}
        onClick={() => onSwitchMode(AUTH_MODES.LOGIN)}
        aria-pressed={mode === AUTH_MODES.LOGIN}
      >
        Log in
      </button>
      <button
        type="button"
        className={mode === AUTH_MODES.SIGNUP ? styles.activeModeButton : styles.modeButton}
        onClick={() => onSwitchMode(AUTH_MODES.SIGNUP)}
        aria-pressed={mode === AUTH_MODES.SIGNUP}
      >
        Sign up
      </button>
    </div>
  );
}

export default ModeSwitch;
