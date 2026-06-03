import styles from './TextField.module.css';

function TextField({ input, meta, label, type = 'text', placeholder }) {
  const fieldError = meta.touched ? meta.error || meta.submitError : '';

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
      />
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default TextField;
