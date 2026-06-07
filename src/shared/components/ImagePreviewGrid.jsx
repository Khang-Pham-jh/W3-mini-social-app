import styles from './ImagePreviewGrid.module.css';

function ImagePreviewGrid({
  items = [],
  ariaLabel = 'Image previews',
  getKey,
  getSrc,
  getAlt,
  getIsMuted = () => false,
  canRemove = () => true,
  onRemove,
  renderFooterAction,
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={styles.previewGrid} aria-label={ariaLabel}>
      {items.map((item, index) => {
        const key = getKey ? getKey(item, index) : index;
        const imageSrc = getSrc(item, index);
        const imageAlt = getAlt ? getAlt(item, index) : 'Image preview';
        const isMuted = getIsMuted(item, index);
        const showRemove = typeof onRemove === 'function' && canRemove(item, index);

        return (
          <li className={styles.previewCard} key={key}>
            <img
              className={isMuted ? styles.previewImageMuted : styles.previewImage}
              src={imageSrc}
              alt={imageAlt}
            />
            {showRemove ? (
              <button
                className={styles.removeButton}
                type="button"
                onClick={() => onRemove(item, index)}
                aria-label="Remove image"
              >
                X
              </button>
            ) : null}
            {renderFooterAction ? renderFooterAction(item, index) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default ImagePreviewGrid;
