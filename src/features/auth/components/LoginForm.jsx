import React, { Component } from 'react';
import { FORM_ERROR } from 'final-form';
import { Field, Form } from 'react-final-form';
import { AuthContext } from '../context/AuthContext';
import { validateLoginForm } from '../../../shared/utils/validation';
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

  renderTextField = ({ input, meta, label, type, placeholder }) => {
    const fieldError = meta.touched ? meta.error || meta.submitError : '';

    return (
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor={input.name}>
          {label}
        </label>
        <input
          {...input}
          id={input.name}
          className={styles.textInput}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(fieldError)}
        />
        <p className={styles.fieldError}>{fieldError}</p>
      </div>
    );
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
              {({ input, meta }) =>
                this.renderTextField({
                  input,
                  meta,
                  label: 'Email',
                  type: 'email',
                  placeholder: 'Enter your email',
                })
              }
            </Field>

            <Field name="password">
              {({ input, meta }) =>
                this.renderTextField({
                  input,
                  meta,
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Enter your password',
                })
              }
            </Field>
            <div className={styles.formFooter}>
              <p className={styles.formError}>{submitError}</p>
            </div>

            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </button>

            <p className={styles.formFooterText}>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </form>
          
        )}
      />
    );
  }
}

export default LoginForm;
