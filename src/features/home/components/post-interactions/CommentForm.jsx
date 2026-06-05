import { Form, Field } from 'react-final-form';
import TextareaField from '../../../../shared/components/TextareaField';
import styles from './PostInteractions.module.css';

function CommentForm({ initialValue = '', onSubmit, isSubmitting, onCancel, placeholder = 'Write a comment...' }) {
  const handleFormSubmit = async (values, form) => {
    const content = (values.content || '').trim();
    if (!content || isSubmitting) return;

    const { success } = await onSubmit(content);
    if (success && !initialValue) {
      form.reset();
    }
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={{ content: initialValue }}
      render={({ handleSubmit, values }) => {
        const currentContent = (values.content || '').trim();
        const canSubmit = currentContent.length > 0 && !isSubmitting;

        return (
          <form className={styles.commentForm} onSubmit={handleSubmit}>
            <Field
              name="content"
              component={TextareaField}
              placeholder={placeholder}
              disabled={isSubmitting}
              rows={2}
              aria-label="Comment content"
            />
            <div className={styles.formActions}>
              {onCancel && (
                <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </button>
              )}
              <button type="submit" className={styles.submitButton} disabled={!canSubmit}>
                {isSubmitting ? 'Saving...' : 'Post'}
              </button>
            </div>
          </form>
        );
      }}
    />
  );
}

export default CommentForm;