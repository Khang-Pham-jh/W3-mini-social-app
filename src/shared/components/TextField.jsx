import styles from './TextField.module.css';

function TextField({ input, meta, label, type = 'text', placeholder }) {
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';
  const errorId = fieldError ? `${input.name}-error` : undefined;

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel} htmlFor={input.name}>
        {label}
      </label>
      <input
        {...input}
        id={input.name}
        className={styles.textInput}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={errorId}
      />
      <p className={styles.fieldError} id={errorId}>{fieldError}</p>
    </div>
  );
}

export default TextField;
