import { useState } from 'react';
import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';
import { createLoginErrors, validateLoginForm } from '../../../shared/utils/validation';

function LoginForm() {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [loginErrors, setLoginErrors] = useState(createLoginErrors);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setLoginFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    setLoginErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
      form: '',
    }));
  }

  function handleLoginSubmit(event) {
    event.preventDefault();

    const validationResult = validateLoginForm(loginFormData);

    if (!validationResult.isValid) {
      setLoginErrors(validationResult.errors);
      return;
    }

    setLoginErrors(createLoginErrors());
  }

  return (
    <div className={styles.loginFormContainer}>
      <form className={styles.authForm} noValidate onSubmit={handleLoginSubmit}>
        <p className={styles.formTitle}>Log in</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            className={styles.textInput}
            type="email"
            placeholder="Enter your email"
            value={loginFormData.email}
            onChange={handleInputChange}
            aria-invalid={Boolean(loginErrors.email)}
          />
          <p className={styles.fieldError}>{loginErrors.email}</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            className={styles.textInput}
            type="password"
            placeholder="Enter your password"
            value={loginFormData.password}
            onChange={handleInputChange}
            aria-invalid={Boolean(loginErrors.password)}
          />
          <p className={styles.fieldError}>{loginErrors.password}</p>
        </div>
        

        <button className={styles.submitButton} type="submit">
          Log in
        </button>
      </form>
        <div className={styles.formError}>{loginErrors.form}</div>
      <p className={styles.formSignupNavigation}>Don't have an account? <Link to="/signup">Sign up</Link></p>

    </div>
  );
}
export default LoginForm;
