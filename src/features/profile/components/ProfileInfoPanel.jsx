import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileInfoPanel.module.css';

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

function getWordCount(text) {
  return String(text ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function ProfileInfoPanel({ profile, isOwner }) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    if (!copyFeedback) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopyFeedback(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copyFeedback]);

  const avatarInitial = useMemo(
    () => (profile?.name ? profile.name.charAt(0).toUpperCase() : '?'),
    [profile?.name],
  );

  const bioWordCount = getWordCount(profile?.bio);
  const shouldShowReadMore = bioWordCount > 200;
  const bioWords = String(profile?.bio ?? '').trim().split(/\s+/).filter(Boolean);
  const displayedBio = shouldShowReadMore && !isBioExpanded
    ? `${bioWords.slice(0, 200).join(' ')}...`
    : profile?.bio;

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback('Copied!');
    } catch {
      setCopyFeedback('Copy failed');
    }
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.avatarShell}>
        {profile?.avatar_url ? (
          <img className={styles.avatarImage} src={profile.avatar_url} alt={`${profile.name}'s avatar`} />
        ) : (
          <div className={styles.avatarFallback}>{avatarInitial}</div>
        )}
      </div>

      <div className={styles.header}>
        <h2 className={styles.name}>{profile?.name || 'Unnamed user'}</h2>
        <p className={styles.position}>{profile?.position || 'No position set'}</p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>DOB</dt>
          <dd className={styles.metaValue}>{formatDate(profile?.dob)}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Status</dt>
          <dd className={styles.metaValue}>
            <span className={styles.statusBadge}>{profile?.status || 'active'}</span>
          </dd>
        </div>
      </dl>

      <section className={styles.bioSection}>
        <h3 className={styles.sectionTitle}>Bio</h3>
        <p className={styles.bioText}>{displayedBio || 'No bio added yet.'}</p>
        {shouldShowReadMore ? (
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => setIsBioExpanded((currentValue) => !currentValue)}
          >
            {isBioExpanded ? 'Show less' : 'Read more'}
          </button>
        ) : null}
      </section>

      <div className={styles.actions}>
        <button className={styles.secondaryButton} type="button" onClick={handleCopyUrl}>
          {copyFeedback || 'Copy URL'}
        </button>
        {isOwner ? (
          <Link className={styles.primaryButton} to="/profile/edit">
            Edit Profile
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export default ProfileInfoPanel;
