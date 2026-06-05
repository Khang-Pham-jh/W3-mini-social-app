import React, { Component } from 'react';
import { FORM_ERROR } from 'final-form';
import { Field, Form } from 'react-final-form';
import { AuthContext } from '../context/AuthContext';
import { validateLoginForm } from '../../../shared/utils/validation';
import TextField from '../../../shared/components/TextField';
import { AUTH_MODES } from '../../../shared/constants/auth.js';
import styles from './LoginForm.module.css';

const initialLoginValues = {
  email: '',
  password: '',
};

class LoginForm extends Component {
  static contextType = AuthContext;

  validate = (values) => {
    return validateLoginForm(values);
  };

  handleSubmit = async (values) => {
    const { login } = this.context;
    const loginResult = await login(values);

    if (!loginResult.success) {
      return {
        email: loginResult.errors?.email,
        [FORM_ERROR]: loginResult.errors?.form,
      };
    }

    this.props.navigate('/home', { replace: true });
    return undefined;
  };

  render() {
    return (
      <Form
        initialValues={initialLoginValues}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        render={({ handleSubmit, submitError, submitting }) => (
          <form className={styles.authForm} noValidate onSubmit={handleSubmit}>
            <p className={styles.formTitle}>Log in</p>

            <Field name="email">
              {(fieldProps) => (
                <TextField
                  {...fieldProps}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              )}
            </Field>

            <Field name="password">
              {(fieldProps) => (
                <TextField
                  {...fieldProps}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />
              )}
            </Field>
            <div className={styles.formFooter}>
              <p className={styles.formError}>{submitError}</p>
            </div>

            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </button>

            <p className={styles.formFooterText}>
              Don't have an account?{' '}
              <a
                href="/signup"
                onClick={(event) => {
                  event.preventDefault();
                  this.props.onSwitchMode?.(AUTH_MODES.SIGNUP);
                }}
              >
                Sign up
              </a>
            </p>
          </form>
          
        )}
      />
    );
  }
}

export default LoginForm;
