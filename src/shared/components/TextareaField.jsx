import styles from './TextareaField.module.css';

function TextareaField({
  input = {},
  meta = {},
  label = '',
  helperText = '',
  error = '',
  id,
  ...rest
}) {
  const textareaId = id || input.name || rest.name;
  const fieldError = error || (
    meta.touched || meta.submitFailed ? meta.error || meta.submitError : ''
  );
  const describedBy = [
    helperText && textareaId ? `${textareaId}-helper` : '',
    fieldError && textareaId ? `${textareaId}-error` : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={styles.fieldGroup}>
      {label ? (
        <label className={styles.fieldLabel} htmlFor={textareaId}>
          {label}
        </label>
      ) : null}
      <textarea
        {...input}
        {...rest}
        id={textareaId}
        className={`${styles.textarea} ${fieldError ? styles.textareaError : ''}`}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={describedBy}
      />
      {helperText ? (
        <p className={styles.helperText} id={`${textareaId}-helper`}>
          {helperText}
        </p>
      ) : null}
      {fieldError ? (
        <p className={styles.fieldError} id={`${textareaId}-error`}>
          {fieldError}
        </p>
      ) : null}
    </div>
  );
}

export default TextareaField;
