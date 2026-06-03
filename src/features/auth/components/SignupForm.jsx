import React, { Component } from 'react';
import { FORM_ERROR } from 'final-form';
import { Field, Form } from 'react-final-form';
import { AuthContext } from '../context/AuthContext';
import { POSITIONS } from '../constants/positions';
import { validateSignupForm } from '../../../shared/utils/validation';
import TextField from '../../../shared/components/TextField';
import PositionSelect from '../../../shared/components/PositionSelect';
import styles from './SignupForm.module.css';

const initialSignupValues = {
  name: '',
  email: '',
  password: '',
  positions: [],
};

class SignupForm extends Component {
  static contextType = AuthContext;

  validate = (values) => {
    return validateSignupForm(values);
  };

  handleSubmit = async (values) => {
    const { signup } = this.context;
    const signupResult = await signup(values);

    if (!signupResult.success) {
      return {
        email: signupResult.errors?.email,
        password: signupResult.errors?.password,
        [FORM_ERROR]: signupResult.errors?.form,
      };
    }

    this.props.navigate('/home', { replace: true });
    return undefined;
  };

  render() {
    return (
      <Form
        initialValues={initialSignupValues}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        render={({ handleSubmit, submitError, submitting, values }) => (
          <form className={styles.authForm} noValidate onSubmit={handleSubmit}>
            <p className={styles.formTitle}>Sign up</p>

            <div className={styles.signupGrid}>
              <Field name="name">
                {(fieldProps) => (
                  <TextField
                    {...fieldProps}
                    label="Name"
                    type="text"
                    placeholder="Enter your name"
                  />
                )}
              </Field>

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

              <Field
                name="positions"
                subscription={{
                  touched: true,
                  error: true,
                  submitError: true,
                  submitFailed: true,
                }}
              >
                {({ meta }) => (
                  <PositionSelect
                    label="Position"
                    fieldName="positions"
                    options={POSITIONS}
                    meta={meta}
                    values={values}
                  />
                )}
              </Field>
            </div>
            <div className={styles.formFooter}>
              <p className={styles.formError}>{submitError}</p>
            </div>

            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
            
            <p className={styles.formFooterText}>
              Already have an account?{' '}
              <a
                href="/login"
                onClick={(event) => {
                  event.preventDefault();
                  this.props.onSwitchMode?.('login');
                }}
              >
                Log in
              </a>
            </p>
          </form>
        )}
      />
    );
  }
}

export default SignupForm;
