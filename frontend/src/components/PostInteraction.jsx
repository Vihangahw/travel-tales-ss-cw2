import './PostInteraction.css';

function PostInteraction({ postId, userId, reactions, onLike, onDislike, onFollow, isFollowing, showFollow, isLiked, isDisliked }) {
  return (
    <div className="post-interaction d-flex flex-wrap align-items-center mt-3">
      <p className="reaction-counts me-3 mb-0 text-muted">
        Likes: {reactions[postId]?.totalLikes || 0} | 
        Dislikes: {reactions[postId]?.totalDislikes || 0}
      </p>
      <button onClick={() => onLike(postId)} className={`btn btn-like me-2 ${isLiked ? 'btn-liked' : ''}`}>
        {isLiked ? 'Liked' : 'Like'}
      </button>
      <button onClick={() => onDislike(postId)} className={`btn btn-dislike me-2 ${isDisliked ? 'btn-disliked' : ''}`}>
        {isDisliked ? 'Disliked' : 'Dislike'}
      </button>
      {showFollow && (
        <button onClick={() => onFollow(userId)} className={`btn btn-follow ${isFollowing ? 'btn-following' : ''}`}>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}

export default PostInteraction;