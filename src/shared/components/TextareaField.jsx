import styles from './TextareaField.module.css';

function TextareaField({ input, meta, ...rest }) {
  return (
    <textarea
      {...input}
      {...rest}
      className={`${styles.textarea} ${meta.error && meta.touched ? styles.error : ''}`}
    />
  );
}

export default TextareaField;