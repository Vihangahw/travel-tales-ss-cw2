import { useState } from 'react';
import PostInteraction from './PostInteraction';
import './PostList.css';

function PostList({ posts, loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts, showTitle = true }) {
  const [expandedPostId, setExpandedPostId] = useState(null);

  const handleToggleExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="post-list-container">
      {showTitle && <h2 className="section-title mb-4">Recent Posts</h2>}
      {posts.map(post => {
        const isExpanded = expandedPostId === post.id;
        return (
          <div key={post.id} className="mb-4">
            <div className={`card post-card shadow-sm ${isExpanded ? 'expanded' : ''}`}>
              <div className="card-body">
                <h3 className="card-title post-title">{post.title}</h3>
                <p className="card-text post-author small">
                  <strong>Author:</strong> <span className="text-muted">{post.username || 'Unknown'}</span>
                </p>
                <p className="card-text post-content">
                  {isExpanded ? post.content : `${post.content.slice(0, 100)}${post.content.length > 100 ? '...' : ''}`}
                </p>
                {isExpanded && (
                  <>
                    <p className="card-text post-meta text-muted small">Country: {post.country_name}</p>
                    <p className="card-text post-meta text-muted small">Visit Date: {post.visit_date}</p>
                    <PostInteraction
                      postId={post.id}
                      userId={post.user_id}
                      reactions={reactions}
                      onLike={onLike}
                      onDislike={onDislike}
                      onFollow={onFollow}
                      isFollowing={followedUsers.has(post.user_id)}
                      showFollow={post.user_id !== loggedInUserId}
                      isLiked={likedPosts.has(post.id)}
                      isDisliked={dislikedPosts.has(post.id)}
                    />
                    {post.user_id === loggedInUserId && (
                      <div className="mt-3 d-flex gap-2">
                        <button onClick={() => onEdit(post)} className="btn btn-edit">Edit</button>
                        <button onClick={() => onDelete(post.id)} className="btn btn-delete">Delete</button>
                      </div>
                    )}
                  </>
                )}
                <button
                  onClick={() => handleToggleExpand(post.id)}
                  className="btn btn-read-more mt-2"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PostList;