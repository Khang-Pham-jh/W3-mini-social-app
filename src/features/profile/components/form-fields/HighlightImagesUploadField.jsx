import { useMemo } from 'react';
import ImageUploadField from '../../../../shared/components/ImageUploadField';
import ImagePreviewGrid from '../../../../shared/components/ImagePreviewGrid';
import styles from './HighlightImagesUploadField.module.css';

function HighlightImagesUploadField({ input, meta, label }) {
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';

  const existingUrls = Array.isArray(input.value?.existingUrls) ? input.value.existingUrls : [];
  const removedUrls = Array.isArray(input.value?.removedUrls) ? input.value.removedUrls : [];
  const newFiles = Array.isArray(input.value?.newFiles) ? input.value.newFiles : [];

  const visibleExistingUrls = useMemo(
    () => existingUrls.filter((imageUrl) => !removedUrls.includes(imageUrl)),
    [existingUrls, removedUrls],
  );

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

  return (
    <div className={styles.fieldGroup}>
      <span className={styles.fieldLabel}>{label}</span>

      <ImageUploadField
        files={newFiles}
        onFilesChange={(nextFiles) => {
          input.onChange({
            existingUrls,
            removedUrls,
            newFiles: nextFiles,
          });
        }}
        buttonLabel="Add highlight images"
        className={styles.uploadShell}
        uploadButtonClassName={styles.uploadButton}
        inputClassName={styles.fileInput}
        renderPreview={({ previews, removeFile }) => {
          const previewItems = [
            ...visibleExistingUrls.map((imageUrl) => ({
              type: 'existing',
              key: imageUrl,
              url: imageUrl,
            })),
            ...removedUrls.map((imageUrl) => ({
              type: 'removed',
              key: `${imageUrl}-removed`,
              url: imageUrl,
            })),
            ...previews.map((preview, index) => ({
              type: 'new',
              key: preview.key,
              url: preview.url,
              index,
            })),
          ];

          return (
            <ImagePreviewGrid
              items={previewItems}
              ariaLabel="Highlight image previews"
              getKey={(item) => item.key}
              getSrc={(item) => item.url}
              getAlt={(item) => {
                if (item.type === 'removed') return 'Removed highlight preview';
                if (item.type === 'new') return 'New highlight preview';
                return 'Existing highlight preview';
              }}
              getIsMuted={(item) => item.type === 'removed'}
              canRemove={(item) => item.type !== 'removed'}
              onRemove={(item) => {
                if (item.type === 'existing') {
                  handleRemoveExisting(item.url);
                  return;
                }

                removeFile(item.index);
              }}
              renderFooterAction={(item) => (
                item.type === 'removed' ? (
                  <button
                    className={styles.restoreButton}
                    type="button"
                    onClick={() => handleRestoreExisting(item.url)}
                  >
                    Restore
                  </button>
                ) : null
              )}
            />
          );
        }}
      />

      <p className={styles.helperText}>
        Add at least one highlight image. Files are only uploaded when you save.
      </p>
      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default HighlightImagesUploadField;
