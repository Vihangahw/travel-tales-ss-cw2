function PostInteraction({ postId, userId, reactions, onLike, onDislike, onFollow, isFollowing, showFollow, isLiked, isDisliked }) {
  return (
    <div>
      <p>
        Likes: {reactions[postId]?.totalLikes || 0} | 
        Dislikes: {reactions[postId]?.totalDislikes || 0}
      </p>
      <button onClick={() => onLike(postId)}>
        {isLiked ? 'Liked' : 'Like'}
      </button>
      <button onClick={() => onDislike(postId)}>
        {isDisliked ? 'Disliked' : 'Dislike'}
      </button>
      {showFollow && (
        <button onClick={() => onFollow(userId)}>
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}

export default PostInteraction;