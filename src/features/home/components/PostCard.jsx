import { Link } from 'react-router-dom';
import AuthorHoverCard from './AuthorHoverCard';
import RoleBadge from './RoleBadge';
import styles from './PostCard.module.css';

function getAuthorName(post) {
  return post.author?.name || 'Unknown user';
}

function formatPostTime(createdAt) {
  if (!createdAt) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(createdAt));
}

function PostCard({ post, onHidePost }) {
  const authorName = getAuthorName(post);
  const avatarInitial = authorName.charAt(0).toUpperCase();
  const profileUrl = `/profile/${post.author?.id}`;

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <AuthorHoverCard author={post.author}>
          <Link to={profileUrl} className={styles.avatarLink}>
            <div className={styles.avatar}>{avatarInitial}</div>
          </Link>
          <div className={styles.authorBlock}>
            <Link to={profileUrl} className={styles.nameLink}>
              <p className={styles.authorName}>{authorName}</p>
            </Link>
            <p className={styles.postMeta}>
              <RoleBadge role={post.author?.position} /> - {formatPostTime(post.createdAt)}
            </p>
          </div>
        </AuthorHoverCard>
        <button
          className={styles.hideButton}
          type="button"
          onClick={() => onHidePost(post.id)}
        >
          Hide
        </button>
      </header>

      {post.content ? <p className={styles.postContent}>{post.content}</p> : null}

      {post.imageUrls.length > 0 ? (
        <div className={styles.imageGrid}>
          {post.imageUrls.map((imageUrl) => (
            <img className={styles.postImage} src={imageUrl} alt="" key={imageUrl} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default PostCard;