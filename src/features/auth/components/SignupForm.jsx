import React, { Component } from 'react';
import { FORM_ERROR } from 'final-form';
import { Field, Form } from 'react-final-form';
import { AuthContext } from '../context/AuthContext';
import { positions } from '../constants/positions';
import { validateSignupForm } from '../../../shared/utils/validation';
import styles from './SignupForm.module.css';

const initialSignupValues = {
  name: '',
  email: '',
  password: '',
  positions: [],
};

class SignupForm extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.positionDropdownRef = React.createRef();
    this.state = {
      isPositionDropdownOpen: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

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

  togglePositionDropdown = () => {
    this.setState((previousState) => ({
      isPositionDropdownOpen: !previousState.isPositionDropdownOpen,
    }));
  };

  handleDocumentMouseDown = (event) => {
    if (!this.state.isPositionDropdownOpen) {
      return;
    }

    if (!this.positionDropdownRef.current?.contains(event.target)) {
      this.setState({
        isPositionDropdownOpen: false,
      });
    }
  };

  handleDocumentKeyDown = (event) => {
    if (event.key !== 'Escape' || !this.state.isPositionDropdownOpen) {
      return;
    }

    this.setState({
      isPositionDropdownOpen: false,
    });
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

  renderPositionField = ({ meta, values }) => {
    const fieldError =
      meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';
    const selectedPositions = Array.isArray(values.positions) ? values.positions : [];
    const triggerLabel =
      selectedPositions.length > 0 ? selectedPositions.join(', ') : 'Select positions';

    return (
      <div className={styles.dropdownFieldGroup} ref={this.positionDropdownRef}>
        <span className={styles.fieldLabel}>Position</span>
        <div className={styles.dropdownControl}>
          <button
            className={styles.dropdownTrigger}
            type="button"
            onClick={this.togglePositionDropdown}
            aria-expanded={this.state.isPositionDropdownOpen}
          >
            <span className={styles.dropdownTriggerText}>{triggerLabel}</span>
            <span className={styles.dropdownTriggerIcon}>
              {this.state.isPositionDropdownOpen ? 'Hide' : 'Select'}
            </span>
          </button>
          <div
            className={
              this.state.isPositionDropdownOpen ? styles.dropdownPanelOpen : styles.dropdownPanel
            }
          >
            <div className={styles.dropdownOptionGrid}>
              {positions.map((position) => (
                <label key={position} className={styles.checkboxItem}>
                  <Field
                    name="positions"
                    component="input"
                    type="checkbox"
                    value={position}
                  />
                  <span>{position}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.fieldError}>{fieldError}</p>
      </div>
    );
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
                {({ input, meta }) =>
                  this.renderTextField({
                    input,
                    meta,
                    label: 'Name',
                    type: 'text',
                    placeholder: 'Enter your name',
                  })
                }
              </Field>

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

              <Field
                name="positions"
                subscription={{
                  touched: true,
                  error: true,
                  submitError: true,
                  submitFailed: true,
                }}
              >
                {({ meta }) => this.renderPositionField({ meta, values })}
              </Field>
            </div>
            <div className={styles.formFooter}>
              <p className={styles.formError}>{submitError}</p>
            </div>

            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
            
            <p className={styles.formFooterText}>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </form>
        )}
      />
    );
  }
}

export default SignupForm;
