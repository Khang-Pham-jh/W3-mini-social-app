import { useEffect, useMemo, useRef, useState } from 'react';
import ImagePreviewGrid from './ImagePreviewGrid';
import styles from './ImageUploadField.module.css';

function normalizeFileList(files) {
  if (!files) {
    return [];
  }

  return Array.isArray(files) ? files.filter(Boolean) : [files].filter(Boolean);
}

function getFileKey(file, index) {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

function ImageUploadField({
  input,
  files,
  onFilesChange,
  accept = 'image/*',
  multiple = true,
  buttonLabel = 'Add images',
  ariaLabel = 'Image previews',
  className = styles.container,
  uploadButtonClassName = styles.uploadButton,
  inputClassName = styles.fileInput,
  renderPreview,
  renderAfterInput,
  previewPlacement = 'after',
}) {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);
  const selectedFiles = useMemo(
    () => normalizeFileList(files ?? input?.value),
    [files, input?.value],
  );
  const handleFilesChange = onFilesChange ?? input?.onChange;

  useEffect(() => {
    const objectUrls = selectedFiles.map((file, index) => ({
      key: getFileKey(file, index),
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  function handleChange(event) {
    const nextSelectedFiles = event.target.files
      ? Array.from(event.target.files).filter(Boolean)
      : [];

    if (nextSelectedFiles.length > 0 && typeof handleFilesChange === 'function') {
      const nextFiles = multiple
        ? [...selectedFiles, ...nextSelectedFiles]
        : nextSelectedFiles.slice(0, 1);

      handleFilesChange(nextFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  function handleRemove(indexToRemove) {
    if (typeof handleFilesChange !== 'function') {
      return;
    }

    handleFilesChange(selectedFiles.filter((_, index) => index !== indexToRemove));
  }

  const previewContent = renderPreview ? (
    renderPreview({
      previews,
      selectedFiles,
      removeFile: handleRemove,
    })
  ) : (
    <ImagePreviewGrid
      items={previews}
      ariaLabel={ariaLabel}
      getKey={(preview) => preview.key}
      getSrc={(preview) => preview.url}
      getAlt={() => 'Upload preview'}
      onRemove={(_, index) => handleRemove(index)}
    />
  );

  return (
    <div className={className}>
      {previewPlacement === 'before' ? previewContent : null}

      <label className={uploadButtonClassName}>
        {buttonLabel}
        <input
          ref={inputRef}
          className={inputClassName}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
      </label>

      {renderAfterInput
        ? renderAfterInput({
            previews,
            selectedFiles,
            removeFile: handleRemove,
          })
        : null}

      {previewPlacement === 'after' ? previewContent : null}
    </div>
  );
}

export default ImageUploadField;
