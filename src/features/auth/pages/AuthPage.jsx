import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import jhLogo from '../../../assets/JH-logo-name.png';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import PageLayout from '../../../shared/components/PageLayout';
import { AUTH_MODES } from '../constants/auth';
import styles from './AuthPage.module.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMode: props.routeMode,
    };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.routeMode !== this.props.routeMode) {
      this.setState({
        activeMode: this.props.routeMode,
      });
    }
  }

  handleModeChange = (nextMode) => {
    if (nextMode === this.state.activeMode) {
      return;
    }

    this.setState({
      activeMode: nextMode,
    });

    this.props.navigate(nextMode === AUTH_MODES.SIGNUP ? '/signup' : '/login');
  };

  renderActiveForm() {
    const sharedProps = {
      navigate: this.props.navigate,
      onSwitchMode: this.handleModeChange,
    };

    if (this.state.activeMode === AUTH_MODES.SIGNUP) {
      return <SignupForm {...sharedProps} />;
    }

    return <LoginForm {...sharedProps} />;
  }

  render() {
    const { activeMode } = this.state;

    return (
      <PageLayout>
        <main className={styles.authPageContainer}>
          <section className={styles.authCard}>
            <div className={styles.headerRow}>
              <img className={styles.logo} src={jhLogo} alt="JH logo" />
            </div>

            <div className={styles.contentArea}>
              <div className={styles.formPanel}>
                <div className={styles.formContent}>{this.renderActiveForm()}</div>
              </div>
            </div>
          </section>
        </main>
      </PageLayout>
    );
  }
}

function AuthPageRoute(props) {
  const navigate = useNavigate();

  return <AuthPage {...props} navigate={navigate} />;
}

export default AuthPageRoute;
