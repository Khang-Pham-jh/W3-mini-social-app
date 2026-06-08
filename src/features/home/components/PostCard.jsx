import { useNavigate } from 'react-router-dom';
import AuthorHoverCard from './AuthorHoverCard';
import RoleBadge from './RoleBadge.jsx';
import styles from './PostCard.module.css';
import PostInteractions from './post-interactions/PostInteractions';

function getAuthorName(post) {
  return post.author?.name || 'Unknown user';
}

function getDisplayAuthor(post, currentUser, currentProfile) {
  const isCurrentUserPost = Boolean(currentUser?.id && post.author?.id === currentUser.id);

  if (!isCurrentUserPost) {
    return post.author;
  }

  return {
    ...post.author,
    name: currentProfile?.name || post.author?.name,
    position: currentProfile?.position || post.author?.position,
    avatar_url: currentProfile?.avatar_url || post.author?.avatar_url,
  };
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
  const displayAuthor = getDisplayAuthor(post, currentUser, currentProfile);
  const displayPost = {
    ...post,
    author: displayAuthor,
  };
  const authorName = getAuthorName(displayPost);
  const avatarInitial = authorName.charAt(0).toUpperCase();
  const avatarUrl = displayAuthor?.avatar_url || '';

  const handleProfileClick = () => {
    if (displayAuthor?.id) {
      navigate(`/profile/${displayAuthor.id}`);
    }
  };

  return (
    <article className={styles.postCard}>
      <header className={styles.postHeader}>
        <AuthorHoverCard author={displayAuthor}>
          <button
            type="button"
            className={styles.avatarLink}
            onClick={handleProfileClick}
            aria-label={`Open ${authorName}'s profile`}
          >
            {avatarUrl ? (
              <img className={styles.avatarImage} src={avatarUrl} alt={`${authorName}'s avatar`} />
            ) : (
              <div className={styles.avatar}>{avatarInitial}</div>
            )}
          </button>
          <div className={styles.authorBlock}>
            <button type="button" className={styles.nameLink} onClick={handleProfileClick}>
              <p className={styles.authorName}>{authorName}</p>
            </button>
            <p className={styles.postMeta}>
              <RoleBadge role={displayAuthor?.position} /> - {formatPostTime(post.createdAt)}
            </p>
          </div>
        </AuthorHoverCard>
        {typeof onHidePost === 'function' ? (
          <button
            className={styles.hideButton}
            type="button"
            onClick={() => onHidePost(post.id)}
          >
            Hide
          </button>
        ) : null}
      </header>

      {post.content ? <p className={styles.postContent}>{post.content}</p> : null}

      {post.imageUrls.length > 0 ? (
        <div className={styles.imageGrid}>
          {post.imageUrls.map((imageUrl) => (
            <img className={styles.postImage} src={imageUrl} alt="Post attachment" key={imageUrl} />
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
