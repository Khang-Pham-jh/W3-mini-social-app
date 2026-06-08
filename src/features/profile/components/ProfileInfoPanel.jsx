import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { POSITIONS } from '../../auth/constants/positions';
import { DEFAULT_PROFILE_STATUS } from '../constants/status';
import styles from './ProfileInfoPanel.module.css';

const PROFILE_POSITION_LABELS = new Map(
  POSITIONS.map((position) => [
    position.key,
    position.key === 'fullstack'
      ? 'Fullstack Developer'
      : position.label.replace(/\bdeveloper\b/g, 'Developer'),
  ]),
);

const POSITION_LABEL_TO_KEY = new Map(
  POSITIONS.map((position) => [position.label.toLowerCase(), position.key]),
);

const BIO_PREVIEW_WORD_LIMIT = 200;

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
  return getBioWords(text).length;
}

function getBioWords(text) {
  return String(text ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function formatPositionDisplay(positionValue) {
  const rawPositions = String(positionValue ?? '')
    .split(',')
    .map((position) => position.trim())
    .filter(Boolean);

  if (rawPositions.length === 0) {
    return 'No position set';
  }

  return rawPositions
    .map((position) => {
      const normalizedPosition = position.toLowerCase();
      const positionKey = PROFILE_POSITION_LABELS.has(position)
        ? position
        : POSITION_LABEL_TO_KEY.get(normalizedPosition);

      return positionKey ? PROFILE_POSITION_LABELS.get(positionKey) : position;
    })
    .join(', ');
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

  useEffect(() => {
    setIsBioExpanded(false);
  }, [profile?.bio]);

  const avatarInitial = useMemo(
    () => (profile?.name ? profile.name.charAt(0).toUpperCase() : '?'),
    [profile?.name],
  );
  const positionDisplay = useMemo(
    () => formatPositionDisplay(profile?.position),
    [profile?.position],
  );

  const bioWordCount = getWordCount(profile?.bio);
  const shouldShowReadMore = bioWordCount > BIO_PREVIEW_WORD_LIMIT;
  const bioWords = getBioWords(profile?.bio);
  const displayedBio = shouldShowReadMore && !isBioExpanded
    ? `${bioWords.slice(0, BIO_PREVIEW_WORD_LIMIT).join(' ')}...`
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
          <img
            className={styles.avatarImage}
            src={profile.avatar_url}
            alt={`${profile?.name || 'User'}'s avatar`}
          />
        ) : (
          <div className={styles.avatarFallback}>{avatarInitial}</div>
        )}
      </div>

      <div className={styles.header}>
        <h2 className={styles.name}>{profile?.name || 'Unnamed user'}</h2>
        <p className={styles.position}>{positionDisplay}</p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Date of Birth</dt>
          <dd className={styles.metaValue}>{formatDate(profile?.dob)}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Status</dt>
          <dd className={styles.metaValue}>
            <span className={styles.statusBadge}>{profile?.status || DEFAULT_PROFILE_STATUS}</span>
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
