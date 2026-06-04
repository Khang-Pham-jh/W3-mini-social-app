import { useState, useRef, useEffect } from 'react';
import RoleBadge from './RoleBadge';
import styles from './AuthorHoverCard.module.css';

function AuthorHoverCard({ author, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), 350); 
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200);
  };

  if (!author) {
    return <>{children}</>;
  }

  const avatarLetter = author.name ? author.name.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={styles.triggerWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={styles.hoverCard}>
          <div className={styles.header}>
            <div className={styles.avatar}>{avatarLetter}</div>
            <div className={styles.userInfo}>
              <div className={styles.name}>{author.name || 'Unknown User'}</div>
              <RoleBadge role={author.position} />
            </div>
          </div>
          {author.email && <div className={styles.email}>{author.email}</div>}
        </div>
      )}
    </div>
  );
}

export default AuthorHoverCard;