import { useState } from 'react';
import { positions } from '../constants/positions';
import styles from './SignupForm.module.css';
import { Link } from 'react-router-dom';
import { createSignupErrors, validateSignupForm } from '../../../shared/utils/validation';

const initialSignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  position: '',
};

function SignupForm() {
  const [signupFormData, setSignupFormData] = useState(initialSignupFormData);
  const [signupErrors, setSignupErrors] = useState(createSignupErrors);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setSignupFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    setSignupErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
      form: '',
    }));
  }

  function handleSignupSubmit(event) {
    event.preventDefault();

    const validationResult = validateSignupForm(signupFormData);

    if (!validationResult.isValid) {
      setSignupErrors(validationResult.errors);
      return;
    }

    setSignupErrors(createSignupErrors());
  }

  return (
    <div className={styles.signupFormContainer}>
      <form className={styles.authForm} noValidate onSubmit={handleSignupSubmit}>
        <p className={styles.formTitle}>Sign up</p>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-name">
            Name
          </label>
          <input
            id="signup-name"
            name="name"
            className={styles.textInput}
            type="text"
            placeholder="Enter your name"
            value={signupFormData.name}
            onChange={handleInputChange}
            aria-invalid={Boolean(signupErrors.name)}
          />
          <p className={styles.fieldError}>{signupErrors.name}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            className={styles.textInput}
            type="email"
            placeholder="Enter your email"
            value={signupFormData.email}
            onChange={handleInputChange}
            aria-invalid={Boolean(signupErrors.email)}
          />
          <p className={styles.fieldError}>{signupErrors.email}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            className={styles.textInput}
            type="password"
            placeholder="Enter your password"
            value={signupFormData.password}
            onChange={handleInputChange}
            aria-invalid={Boolean(signupErrors.password)}
          />
          <p className={styles.fieldError}>{signupErrors.password}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-confirm-password">
            Confirm Password
          </label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            className={styles.textInput}
            type="password"
            placeholder="Confirm your password"
            value={signupFormData.confirmPassword}
            onChange={handleInputChange}
            aria-invalid={Boolean(signupErrors.confirmPassword)}
          />
          <p className={styles.fieldError}>{signupErrors.confirmPassword}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="signup-position">
            Position
          </label>
          <select
            id="signup-position"
            name="position"
            className={styles.selectInput}
            value={signupFormData.position}
            onChange={handleInputChange}
            aria-invalid={Boolean(signupErrors.position)}
          >
            <option value="" disabled>
              Select your position
            </option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <p className={styles.fieldError}>{signupErrors.position}</p>
        </div>

      

        <button className={styles.submitButton} type="submit">
          Sign up
        </button>
      </form>

        <div className={styles.formError}>{signupErrors.form}</div>

      <p className={styles.formLoginNavigation}>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
export default SignupForm;
