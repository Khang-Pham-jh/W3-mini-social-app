import { useEffect, useState, useRef } from 'react';
import styles from './ImageUploadField.module.css';

function ImageUploadField({ input: { value, onChange } }) {
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const files = Array.isArray(value) ? value : [];
    const objectUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [value]);

  const handleChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const currentFiles = Array.isArray(value) ? value : [];
      const newFiles = [...currentFiles, ...Array.from(event.target.files)];
      onChange(newFiles);
    }
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove) => {
    const currentFiles = Array.isArray(value) ? value : [];
    const newFiles = currentFiles.filter((_, idx) => idx !== indexToRemove);
    onChange(newFiles);
  };

  return (
    <div className={styles.container}>
      <label className={styles.uploadButton}>
        Add images
        <input type="file" accept="image/*" multiple onChange={handleChange} ref={inputRef} />
      </label>

      {previews.length > 0 ? (
        <ul className={styles.previewContainer} aria-label="Image previews">
          {previews.map((preview, index) => (
            <li key={preview.url} className={styles.previewWrapper}>
              <img src={preview.url} alt="Upload preview" className={styles.previewImage} />
              <button type="button" onClick={() => handleRemove(index)} className={styles.removeButton} aria-label="Remove image">
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default ImageUploadField;