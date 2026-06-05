import { useMemo } from 'react';
import styles from './HighlightSlider.module.css';

function normalizeHighlightItems(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `${item}-${index}`,
          url: item,
          title: '',
          description: '',
        };
      }

      if (item && typeof item === 'object') {
        const url = item.url || item.src || '';

        return {
          id: item.id || `${url}-${index}` || `highlight-${index}`,
          url,
          title: item.title || '',
          subtitle: item.subtitle || item.gallery || item.author || '',
          description: item.description || item.caption || item.dateLabel || item.date || '',
        };
      }

      return null;
    })
    .filter((item) => item?.url);
}

function getAltText(item, index) {
  if (item.title) {
    return item.title;
  }

  if (item.description) {
    return item.description;
  }

  return `Highlight image ${index + 1}`;
}

function HighlightCard({ item, index }) {
  const hasText = Boolean(item.title || item.description);

  return (
    <li className={styles.cardItem}>
      <article className={styles.card}>
        <div className={styles.imageFrame}>
          <img className={styles.image} src={item.url} alt={getAltText(item, index)} />
        </div>

        {hasText ? (
          <div className={styles.cardBody}>
            {item.title ? <h3 className={styles.cardTitle}>{item.title}</h3> : null}
            {item.subtitle ? <p className={styles.cardSubtitle}>{item.subtitle}</p> : null}
            {item.description ? <p className={styles.cardDescription}>{item.description}</p> : null}
          </div>
        ) : null}
      </article>
    </li>
  );
}

function HighlightSlider({ images }) {
  const items = useMemo(() => normalizeHighlightItems(images), [images]);

  if (items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No highlight images available.</p>
      </div>
    );
  }

  return (
    <section className={styles.sliderSection} aria-label="Profile highlights">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Highlights</p>
          <h2 className={styles.title}>Collected moments</h2>
        </div>
      </div>

      <div
        className={styles.viewport}
        tabIndex={0}
        aria-label="Highlight image slider"
      >
        <ul className={styles.track}>
          {items.map((item, index) => (
            <HighlightCard item={item} index={index} key={item.id} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HighlightSlider;
