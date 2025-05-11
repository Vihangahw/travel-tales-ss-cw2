function PostInteraction({ postId, userId, reactions, onLike, onDislike, onFollow, isFollowing, showFollow }) {
  return (
    <div>
      <p>
        Likes: {reactions[postId]?.totalLikes || 0} | 
        Dislikes: {reactions[postId]?.totalDislikes || 0}
      </p>
      <button onClick={() => onLike(postId)}>Like</button>
      <button onClick={() => onDislike(postId)}>Dislike</button>
      {showFollow && (
        <button onClick={() => onFollow(userId)}> 
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}

export default PostInteraction;