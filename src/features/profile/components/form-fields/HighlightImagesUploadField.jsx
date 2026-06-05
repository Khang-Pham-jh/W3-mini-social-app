import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './HighlightImagesUploadField.module.css';

function HighlightImagesUploadField({ input, meta, label }) {
  const inputRef = useRef(null);
  const [localPreviews, setLocalPreviews] = useState([]);
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';

  const existingUrls = Array.isArray(input.value?.existingUrls) ? input.value.existingUrls : [];
  const removedUrls = Array.isArray(input.value?.removedUrls) ? input.value.removedUrls : [];
  const newFiles = Array.isArray(input.value?.newFiles) ? input.value.newFiles : [];

  useEffect(() => {
    const objectUrls = newFiles.map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}`,
      url: URL.createObjectURL(file),
    }));

    setLocalPreviews(objectUrls);

    return () => {
      objectUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [newFiles]);

  const visibleExistingUrls = useMemo(
    () => existingUrls.filter((imageUrl) => !removedUrls.includes(imageUrl)),
    [existingUrls, removedUrls],
  );

  function handleFileChange(event) {
    const selectedFiles = event.target.files ? Array.from(event.target.files).filter(Boolean) : [];

    if (selectedFiles.length === 0) {
      return;
    }

    input.onChange({
      existingUrls,
      removedUrls,
      newFiles: [...newFiles, ...selectedFiles],
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleRemoveExisting(imageUrl) {
    if (removedUrls.includes(imageUrl)) {
      return;
    }

    input.onChange({
      existingUrls,
      removedUrls: [...removedUrls, imageUrl],
      newFiles,
    });
  }

  function handleRestoreExisting(imageUrl) {
    input.onChange({
      existingUrls,
      removedUrls: removedUrls.filter((url) => url !== imageUrl),
      newFiles,
    });
  }

  function handleRemoveNewFile(indexToRemove) {
    input.onChange({
      existingUrls,
      removedUrls,
      newFiles: newFiles.filter((_, index) => index !== indexToRemove),
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>

      <label className={styles.uploadButton}>
        Add highlight images
        <input
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </label>

      <div className={styles.previewGrid}>
        {visibleExistingUrls.map((imageUrl) => (
          <div className={styles.previewCard} key={imageUrl}>
            <img className={styles.previewImage} src={imageUrl} alt="Existing highlight preview" />
            <button className={styles.removeButton} type="button" onClick={() => handleRemoveExisting(imageUrl)}>
              Remove
            </button>
          </div>
        ))}

        {removedUrls.map((imageUrl) => (
          <div className={styles.previewCard} key={`${imageUrl}-removed`}>
            <img className={styles.previewImageMuted} src={imageUrl} alt="Removed highlight preview" />
            <button className={styles.restoreButton} type="button" onClick={() => handleRestoreExisting(imageUrl)}>
              Restore
            </button>
          </div>
        ))}

        {localPreviews.map((preview, index) => (
          <div className={styles.previewCard} key={`${preview.key}-${index}`}>
            <img className={styles.previewImage} src={preview.url} alt="New highlight preview" />
            <button className={styles.removeButton} type="button" onClick={() => handleRemoveNewFile(index)}>
              Remove new
            </button>
          </div>
        ))}
      </div>

      <p className={styles.helperText}>
        Keep at least one highlight image. Files are only uploaded when you save.
      </p>
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default HighlightImagesUploadField;

