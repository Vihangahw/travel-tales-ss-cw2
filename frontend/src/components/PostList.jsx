import PostInteraction from './PostInteraction';

function PostList({ posts, loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow }) {
  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Country: {post.country_name}</p>
          <p>Visit Date: {post.visit_date}</p>
          <PostInteraction
            postId={post.id}
            reactions={reactions}
            onLike={onLike}
            onDislike={onDislike}
            onFollow={() => onFollow(post.user_id)}
          />
          {post.user_id === loggedInUserId && (
            <>
              <button onClick={() => onEdit(post)}>Edit</button>
              <button onClick={() => onDelete(post.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;