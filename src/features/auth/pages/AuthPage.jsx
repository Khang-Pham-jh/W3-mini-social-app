import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import jhLogo from '../../../assets/JH-logo-name.png';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import TopBar from '../../../shared/components/TopBar';
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

    this.props.navigate(nextMode === 'signup' ? '/signup' : '/login');
  };

  renderActiveForm() {
    const sharedProps = {
      navigate: this.props.navigate,
      onSwitchMode: this.handleModeChange,
    };

    if (this.state.activeMode === 'signup') {
      return <SignupForm {...sharedProps} />;
    }

    return <LoginForm {...sharedProps} />;
  }

  render() {
    const { activeMode } = this.state;

    return (
      <TopBar>
        <main className={styles.authPageContainer}>
          <section className={styles.authCard}>
            <div className={styles.headerRow}>
              <img className={styles.logo} src={jhLogo} alt="JH logo" />
              <div className={styles.modeSwitch} role="tablist" aria-label="Authentication mode">
                <button
                  className={activeMode === 'login' ? styles.activeModeButton : styles.modeButton}
                  type="button"
                  onClick={() => this.handleModeChange('login')}
                >
                  Log in
                </button>
                <button
                  className={activeMode === 'signup' ? styles.activeModeButton : styles.modeButton}
                  type="button"
                  onClick={() => this.handleModeChange('signup')}
                >
                  Sign up
                </button>
              </div>
            </div>

            <div className={styles.contentArea}>
              <div className={styles.formPanel}>
                <div className={styles.formContent}>{this.renderActiveForm()}</div>
              </div>
            </div>
          </section>
        </main>
      </TopBar>
    );
  }
}

function AuthPageRoute(props) {
  const navigate = useNavigate();

  return <AuthPage {...props} navigate={navigate} />;
}

export default AuthPageRoute;
