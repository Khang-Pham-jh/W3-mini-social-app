import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';

function LoginForm() {
  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.authForm} noValidate>
        <p className={styles.formTitle}>Log in</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Email</label>
          <input className={styles.textInput} type="email" placeholder="Enter your email" />
          <p className={styles.fieldError}>Invalid email or password</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Password</label>
          <input className={styles.textInput} type="password" placeholder="Enter your password" />
          <p className={styles.fieldError}>Invalid email or password</p>
        </div>
        <div>{/* Error message area */}</div>

        <button className={styles.submitButton} type="submit">
          Log in
        </button>
      </form>

      <p className={styles.formSignupNavigation}>Don't have an account? <Link to="/signup">Sign up</Link></p>

    </div>
  );
}
export default LoginForm;
