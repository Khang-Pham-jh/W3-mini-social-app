import { positions } from '../constants/positions';
import styles from './SignupForm.module.css';
import { Link } from 'react-router-dom';

function SignupForm() {
  return (
    <div className={styles.signupFormContainer}>
      <form className={styles.authForm} noValidate>
        <p className={styles.formTitle}>Sign up</p>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.textInput} type="text" placeholder="Enter your name" />
          <p className={styles.fieldError}>Invalid name</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Email</label>
          <input className={styles.textInput} type="email" placeholder="Enter your email" />
          <p className={styles.fieldError}>Invalid email</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Password</label>
          <input className={styles.textInput} type="password" placeholder="Enter your password" />
          <p className={styles.fieldError}>Invalid password</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Confirm Password</label>
          <input className={styles.textInput} type="password" placeholder="Confirm your password" />
          <p className={styles.fieldError}>Passwords do not match</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Position</label>
          <select className={styles.selectInput}>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <p className={styles.fieldError}>Please select a position</p>
        </div>

        <div>{/* Error message area */}</div>

        <button className={styles.submitButton} type="submit">
          Sign up
        </button>
      </form>

      <p className={styles.formLoginNavigation}>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
export default SignupForm;
