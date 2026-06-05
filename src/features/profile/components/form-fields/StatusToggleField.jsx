import styles from './StatusToggleField.module.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function StatusToggleField({ input, label }) {
  const currentValue = input.value || 'active';

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.toggleGroup} role="radiogroup" aria-label={label}>
        {STATUS_OPTIONS.map((option) => (
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

