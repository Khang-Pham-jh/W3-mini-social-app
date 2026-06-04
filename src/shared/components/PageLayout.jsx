import TopBar from './TopBar';
import { useAuth } from '../../features/auth/context/AuthContext';
import styles from './TopBar.module.css';

function PageLayout({ children }) {
  const { isLoggedIn } = useAuth();

  return (
    <div className={styles.shell} data-auth={isLoggedIn ? 'logged-in' : 'logged-out'}>
      <TopBar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default PageLayout;