import { useEffect, useMemo, useRef, useState } from 'react';
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
          description: item.description || '',
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
            {item.description ? <p className={styles.cardDescription}>{item.description}</p> : null}
          </div>
        ) : null}
      </article>
    </li>
  );
}

function SliderControls({ canScrollPrev, canScrollNext, onPrev, onNext }) {
  return (
    <div className={styles.controls} aria-label="Highlight slider controls">
      <button
        type="button"
        className={styles.controlButton}
        onClick={onPrev}
        disabled={!canScrollPrev}
        aria-label="Previous highlights"
      >
        Prev
      </button>
      <button
        type="button"
        className={styles.controlButton}
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label="Next highlights"
      >
        Next
      </button>
    </div>
  );
}

function HighlightSlider({ images }) {
  const viewportRef = useRef(null);
  const items = useMemo(() => normalizeHighlightItems(images), [images]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    function syncControls() {
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      const currentScrollLeft = viewport.scrollLeft;
      const edgeTolerance = 2;

      setCanScrollPrev(currentScrollLeft > edgeTolerance);
      setCanScrollNext(currentScrollLeft < maxScrollLeft - edgeTolerance);
    }

    syncControls();
    viewport.addEventListener('scroll', syncControls, { passive: true });
    window.addEventListener('resize', syncControls);

    return () => {
      viewport.removeEventListener('scroll', syncControls);
      window.removeEventListener('resize', syncControls);
    };
  }, [items.length]);

  function scrollByPage(direction) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const scrollAmount = viewport.clientWidth * 0.92;

    viewport.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  }

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
        <SliderControls
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          onPrev={() => scrollByPage(-1)}
          onNext={() => scrollByPage(1)}
        />
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
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
