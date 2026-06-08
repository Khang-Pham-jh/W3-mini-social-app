import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import PageLayout from './PageLayout';
import styles from './ProtectedRoute.module.css';

function ProtectedRoute({ children }) {
  const { isAuthLoading, isLoggedIn } = useAuth();

  if (isAuthLoading) {
    return (
      <PageLayout>
        <section className={styles.loadingState}>
          <p className={styles.loadingText}>Checking your session...</p>
        </section>
      </PageLayout>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
