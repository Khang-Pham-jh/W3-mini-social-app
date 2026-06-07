import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import TextareaField from '../../../shared/components/TextareaField';
import ImageUploadField from '../../../shared/components/ImageUploadField';
import styles from './PostComposer.module.css';

function PostComposer({ currentProfile, currentUser, onCreatePost }) {
  const [formError, setFormError] = useState('');
  const displayName = getDisplayName(currentProfile, currentUser);

  const onSubmit = async (values, form) => {
    const content = values.content || '';
    const imageFiles = values.imageFiles || [];

    const result = await onCreatePost({
      content,
      imageFiles,
    });

    if (!result.success) {
      setFormError(result.error);
      return;
    }

    setFormError('');
    form.reset();
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ content: '', imageFiles: [] }}
      render={({ handleSubmit, values, submitting }) => {
        const content = values.content || '';
        const imageFiles = values.imageFiles || [];
        const hasContent = content.trim().length > 0;
        const canSubmit = !submitting && (hasContent || imageFiles.length > 0);

        return (
          <form className={styles.composer} onSubmit={handleSubmit}>
            <div className={styles.composerHeader}>
              <Link className={styles.profileLink} to="/profile">
                <span className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</span>
              </Link>
              <hgroup>
                <h2 className={styles.title}>Create post</h2>
                <p className={styles.subtitle}>
                  Posting as <Link className={styles.authorLink} to="/profile">{displayName}</Link>
                </p>
              </hgroup>
            </div>

            <Field name="content" component={TextareaField} placeholder="Share an update with your team" rows={4} aria-label="Post content" />
            <Field name="imageFiles" component={ImageUploadField} />

            {formError ? <p className={styles.errorText}>{formError}</p> : null}

            <div className={styles.actions}>
              <button className={styles.submitButton} type="submit" disabled={!canSubmit}>
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        );
      }}
    />
  );
}

export default PostComposer;

function getDisplayName(currentProfile, currentUser) {
  return currentProfile?.name || currentUser?.user_metadata?.name || 'You';
}
