import { useEffect, useRef, useState } from 'react';
import styles from './AvatarUploadField.module.css';

function AvatarUploadField({ input, meta, label }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';

  useEffect(() => {
    if (input.value?.newFile) {
      const objectUrl = URL.createObjectURL(input.value.newFile);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreviewUrl(input.value?.existingUrl || '');
    return undefined;
  }, [input.value]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    input.onChange({
      ...input.value,
      newFile: nextFile,
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleClearNewSelection() {
    input.onChange({
      ...input.value,
      newFile: null,
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  const avatarInitial = input.value?.existingUrl || input.value?.newFile ? '' : '?';

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>

      <div className={styles.avatarPreview}>
        {previewUrl ? (
          <img className={styles.avatarImage} src={previewUrl} alt="Avatar preview" />
        ) : (
          <div className={styles.avatarFallback}>{avatarInitial}</div>
        )}
      </div>

      <div className={styles.actions}>
        <label className={styles.uploadButton}>
          Choose avatar
          <input
            ref={inputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {input.value?.newFile ? (
          <button className={styles.secondaryButton} type="button" onClick={handleClearNewSelection}>
            Remove new file
          </button>
        ) : null}
      </div>

      <p className={styles.helperText}>An avatar is required for your public profile.</p>
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default AvatarUploadField;

