import ImageUploadField from '../../../../shared/components/ImageUploadField';
import styles from './AvatarUploadField.module.css';

function AvatarUploadField({ input, meta, label }) {
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';

  function handleClearNewSelection() {
    input.onChange({
      ...input.value,
      newFile: null,
    });
  }

  const avatarInitial = input.value?.existingUrl || input.value?.newFile ? '' : '?';

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>

      <ImageUploadField
        files={input.value?.newFile ? [input.value.newFile] : []}
        onFilesChange={(nextFiles) => {
          input.onChange({
            ...input.value,
            newFile: nextFiles[0] ?? null,
          });
        }}
        multiple={false}
        buttonLabel="Choose avatar"
        className={styles.uploadShell}
        uploadButtonClassName={styles.uploadButton}
        inputClassName={styles.fileInput}
        previewPlacement="before"
        renderPreview={({ previews }) => {
          const previewUrl = previews[0]?.url || input.value?.existingUrl || '';

          return (
            <div className={styles.avatarPreview}>
              {previewUrl ? (
                <img className={styles.avatarImage} src={previewUrl} alt="Avatar preview" />
              ) : (
                <div className={styles.avatarFallback}>{avatarInitial}</div>
              )}
            </div>
          );
        }}
        renderAfterInput={() => {
          if (!input.value?.newFile) {
            return null;
          }

          return (
            <button className={styles.secondaryButton} type="button" onClick={handleClearNewSelection}>
              Remove
            </button>
          );
        }}
      />

      <p className={styles.helperText}>An avatar is required for your public profile.</p>
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default AvatarUploadField;
