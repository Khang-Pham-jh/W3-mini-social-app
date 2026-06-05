import TextareaField from '../../../../shared/components/TextareaField';
import styles from './ProfileTextareaField.module.css';

function ProfileTextareaField({ input, meta, label, ...rest }) {
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel} htmlFor={input.name}>
        {label}
      </label>
      <TextareaField input={input} meta={meta} {...rest} />
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default ProfileTextareaField;

