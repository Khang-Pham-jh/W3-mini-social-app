import { POSITIONS } from '../../auth/constants/positions';
import styles from './RoleBadge.module.css';

const ROLE_COLORS = {
  fe_developer: styles.badgeFeDeveloper,
  be_developer: styles.badgeBeDeveloper,
  fullstack: styles.badgeFullstack,
  designers: styles.badgeDesigners,
  admin: styles.badgeAdmin,
  hr: styles.badgeHr,
  ba: styles.badgeBa,
  pm: styles.badgePm,
  testers: styles.badgeTesters,
};

function RoleBadge({ role }) {
  const userRoles = Array.isArray(role)
    ? role
    : typeof role === 'string'
      ? role.split(',').map((r) => r.trim())
      : [];

  const normalizedRoles = userRoles.map((r) => r.toLowerCase());

  // POSITIONS is ordered, so find() naturally picks the match with the smallest index
  const bestPosition = POSITIONS.find(
    (p) =>
      normalizedRoles.includes(p.key.toLowerCase()) ||
      normalizedRoles.includes(p.label.toLowerCase())
  );

  const badgeClass = bestPosition ? ROLE_COLORS[bestPosition.key] : styles.badgeDefault;
  const displayRole = bestPosition ? bestPosition.label : (userRoles[0] || 'Member');

  return (
    <span className={`${styles.badge} ${badgeClass}`}>
      {displayRole}
    </span>
  );
}

export default RoleBadge;