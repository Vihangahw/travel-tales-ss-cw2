function PostInteraction({ postId, reactions, onLike, onDislike, onFollow }) {
  return (
    <div>
      <p>
        Likes: {reactions[postId]?.totalLikes || 0} | 
        Dislikes: {reactions[postId]?.totalDislikes || 0}
      </p>
      <button onClick={() => onLike(postId)}>Like</button>
      <button onClick={() => onDislike(postId)}>Dislike</button>
      <button onClick={() => onFollow(postId)}>Follow</button>
    </div>
  );
}

export default PostInteraction;