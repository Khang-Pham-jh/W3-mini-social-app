import { DEFAULT_PROFILE_STATUS, STATUS_OPTIONS } from '../../constants/status';
import styles from './StatusToggleField.module.css';

const STATUS_CHOICES = [
  { value: STATUS_OPTIONS.active, label: 'Active' },
  { value: STATUS_OPTIONS.inactive, label: 'Inactive' },
];

function StatusToggleField({ input, label }) {
  const currentValue = input.value || DEFAULT_PROFILE_STATUS;

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.toggleGroup} role="radiogroup" aria-label={label}>
        {STATUS_CHOICES.map((option) => (
          <button
            key={option.value}
            className={currentValue === option.value ? styles.toggleActive : styles.toggleButton}
            type="button"
            onClick={() => input.onChange(option.value)}
            aria-pressed={currentValue === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusToggleField;
