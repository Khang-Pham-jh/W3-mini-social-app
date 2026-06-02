import { Link, Outlet } from 'react-router-dom';
import styles from './Authpage.module.css';
export default function AuthPage() {
  return (
    <main className={styles.authPageContainer}>
      <Outlet />
    </main>
  );
}
