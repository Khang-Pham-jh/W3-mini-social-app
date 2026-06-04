import { useState } from 'react';
import styles from './PostComposer.module.css';

function getDisplayName(currentProfile, currentUser) {
  return currentProfile?.name || currentUser?.user_metadata?.name || 'You';
}

function PostComposer({ currentProfile, currentUser, isSubmitting, onCreatePost }) {
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [formError, setFormError] = useState('');

  const hasContent = content.trim().length > 0;
  const canSubmit = !isSubmitting && (hasContent || imageFiles.length > 0);
  const displayName = getDisplayName(currentProfile, currentUser);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const result = await onCreatePost({
      content,
      imageFiles,
    });

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setContent('');
    setImageFiles([]);
    setFormError('');
  }

  function handleImageChange(event) {
    setImageFiles(Array.from(event.target.files ?? []));
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <div className={styles.composerHeader}>
        <div className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <p className={styles.title}>Create post</p>
          <p className={styles.subtitle}>Posting as {displayName}</p>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        value={content}
        placeholder="Share an update with your team"
        rows={4}
        onChange={(event) => setContent(event.target.value)}
      />

      <div className={styles.actions}>
        <label className={styles.imageInput}>
          Add images
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        </label>

        <button className={styles.submitButton} type="submit" disabled={!canSubmit}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {imageFiles.length > 0 ? (
        <p className={styles.helperText}>{imageFiles.length} image selected</p>
      ) : null}
      {formError ? <p className={styles.errorText}>{formError}</p> : null}
    </form>
  );
}

export default PostComposer;
