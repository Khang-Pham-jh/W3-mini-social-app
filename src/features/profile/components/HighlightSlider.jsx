import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './HighlightSlider.module.css';

const MIN_THUMB_WIDTH = 56;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

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
  const hasText = Boolean(item.title || item.subtitle || item.description);

  return (
    <li className={styles.cardItem}>
      <article className={styles.card}>
        <div className={styles.imageFrame}>
          <img
            className={styles.image}
            src={item.url}
            alt={getAltText(item, index)}
            draggable="false"
          />
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
  const viewportRef = useRef(null);
  const scrollbarRef = useRef(null);
  const thumbDragRef = useRef(null);
  const items = useMemo(() => normalizeHighlightItems(images), [images]);
  const [thumbMetrics, setThumbMetrics] = useState({
    width: MIN_THUMB_WIDTH,
    left: 0,
    scrollPercent: 0,
  });
  const [isThumbDragging, setIsThumbDragging] = useState(false);

  function scrollToThumbLeft(nextThumbLeft, maxThumbLeft, maxScrollLeft) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const scrollRatio = maxThumbLeft > 0 ? nextThumbLeft / maxThumbLeft : 0;

    viewport.scrollLeft = scrollRatio * maxScrollLeft;
    setThumbMetrics((currentMetrics) => ({
      ...currentMetrics,
      left: nextThumbLeft,
      scrollPercent: scrollRatio * 100,
    }));
  }

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    function syncThumb() {
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      const trackWidth = scrollbarRef.current?.clientWidth ?? 0;
      const thumbWidth = maxScrollLeft > 0 && viewport.scrollWidth > 0
        ? Math.max(MIN_THUMB_WIDTH, (viewport.clientWidth / viewport.scrollWidth) * trackWidth)
        : trackWidth;
      const maxThumbLeft = Math.max(trackWidth - thumbWidth, 0);
      const thumbLeft = maxScrollLeft > 0
        ? (viewport.scrollLeft / maxScrollLeft) * maxThumbLeft
        : 0;

      setThumbMetrics({
        width: thumbWidth,
        left: thumbLeft,
        scrollPercent: maxScrollLeft > 0 ? Math.round((viewport.scrollLeft / maxScrollLeft) * 100) : 0,
      });
    }

    syncThumb();
    viewport.addEventListener('scroll', syncThumb, { passive: true });
    window.addEventListener('resize', syncThumb);

    return () => {
      viewport.removeEventListener('scroll', syncThumb);
      window.removeEventListener('resize', syncThumb);
    };
  }, [items.length]);

  function handleThumbPointerDown(event) {
    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;

    if (!viewport || !scrollbar || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    thumbDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startThumbLeft: thumbMetrics.left,
      maxThumbLeft: Math.max(scrollbar.clientWidth - thumbMetrics.width, 0),
      maxScrollLeft: viewport.scrollWidth - viewport.clientWidth,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsThumbDragging(true);
    event.preventDefault();
  }

  function handleThumbPointerMove(event) {
    const viewport = viewportRef.current;
    const dragState = thumbDragRef.current;

    if (!viewport || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextThumbLeft = clamp(
      dragState.startThumbLeft + event.clientX - dragState.startX,
      0,
      dragState.maxThumbLeft,
    );

    scrollToThumbLeft(nextThumbLeft, dragState.maxThumbLeft, dragState.maxScrollLeft);
    event.preventDefault();
  }

  function endThumbDrag(event) {
    const dragState = thumbDragRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    thumbDragRef.current = null;
    setIsThumbDragging(false);
  }

  function handleScrollbarPointerDown(event) {
    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;

    if (
      !viewport ||
      !scrollbar ||
      event.target !== event.currentTarget ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return;
    }

    const scrollbarRect = scrollbar.getBoundingClientRect();
    const maxThumbLeft = Math.max(scrollbar.clientWidth - thumbMetrics.width, 0);
    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const nextThumbLeft = clamp(
      event.clientX - scrollbarRect.left - thumbMetrics.width / 2,
      0,
      maxThumbLeft,
    );

    scrollToThumbLeft(nextThumbLeft, maxThumbLeft, maxScrollLeft);
    event.preventDefault();
  }

  function handleThumbKeyDown(event) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const step = Math.max(viewport.clientWidth * 0.12, 40);
    let nextScrollLeft = viewport.scrollLeft;

    if (event.key === 'ArrowLeft') {
      nextScrollLeft -= step;
    } else if (event.key === 'ArrowRight') {
      nextScrollLeft += step;
    } else if (event.key === 'Home') {
      nextScrollLeft = 0;
    } else if (event.key === 'End') {
      nextScrollLeft = maxScrollLeft;
    } else {
      return;
    }

    viewport.scrollLeft = Math.min(Math.max(nextScrollLeft, 0), maxScrollLeft);
    event.preventDefault();
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
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        aria-label="Highlight image row"
      >
        <ul className={styles.track}>
          {items.map((item, index) => (
            <HighlightCard item={item} index={index} key={item.id} />
          ))}
        </ul>
      </div>

      <div
        className={styles.customScrollbar}
        ref={scrollbarRef}
        onPointerDown={handleScrollbarPointerDown}
      >
        <div
          className={isThumbDragging ? styles.scrollbarThumbActive : styles.scrollbarThumb}
          role="slider"
          tabIndex={0}
          aria-label="Scroll highlight images"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(thumbMetrics.scrollPercent)}
          style={{
            width: `${thumbMetrics.width}px`,
            transform: `translateX(${thumbMetrics.left}px)`,
          }}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={endThumbDrag}
          onPointerCancel={endThumbDrag}
          onKeyDown={handleThumbKeyDown}
        />
      </div>
    </section>
  );
}

export default HighlightSlider;
