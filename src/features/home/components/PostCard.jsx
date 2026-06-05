import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import AuthorHoverCard from './AuthorHoverCard';
import RoleBadge from './RoleBadge.jsx';
import PostInteractions from './post-interactions/PostInteractions';
import styles from './PostCard.module.css';
import PostInteractions from './post-interactions/PostInteractions.jsx';

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

function PostCard({ post, onHidePost, currentUser, currentProfile }) {
  const navigate = useNavigate();
  const { currentUser, currentProfile } = useAuth();
  const authorName = getAuthorName(post);
  const avatarInitial = authorName.charAt(0).toUpperCase();

  const handleProfileClick = () => {
    if (post.author?.id) {
      // Navigating to exact `/profile` path prevents 404s on unconfigured dynamic routes.
      // The target ID is securely passed via router state.
      navigate('/profile', { state: { profileId: post.author.id } });
    }
  };

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <AuthorHoverCard author={post.author}>
          <button type="button" className={styles.avatarLink} onClick={handleProfileClick}>
            <div className={styles.avatar}>{avatarInitial}</div>
          </button>
          <div className={styles.authorBlock}>
            <button type="button" className={styles.nameLink} onClick={handleProfileClick}>
              <p className={styles.authorName}>{authorName}</p>
            </button>
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
          {post.imageUrls.map((imageUrl, index) => (
            <img className={styles.postImage} src={imageUrl} alt={`Post attachment ${index + 1}`} key={imageUrl} />
          ))}
        </div>
      ) : null}

      <PostInteractions 
        postId={post.id} 
        currentUser={currentUser} 
        currentProfile={currentProfile} 
      />
    </article>
  );
}

export default PostCard;