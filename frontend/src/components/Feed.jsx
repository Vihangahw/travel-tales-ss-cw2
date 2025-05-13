import { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';
import './Feed.css';

function Feed({ loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts, currentToken }) {
  const [followedPosts, setFollowedPosts] = useState([]);

  useEffect(() => {
    if (loggedInUserId && currentToken) {
      axios.get(`http://localhost:4000/users/profile/${loggedInUserId}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
        .then(response => {
          setFollowedPosts(response.data.followedFeed || []);
        })
        .catch(error => {
          console.error('Error fetching followed feed:', error);
          setFollowedPosts([]);
        });
    }
  }, [loggedInUserId, currentToken]);

  return (
    <div className="feed-container">
      <h2 className="section-title mb-4">Followed Feed</h2>
      <PostList
        posts={followedPosts}
        loggedInUserId={loggedInUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        reactions={reactions}
        onLike={onLike}
        onDislike={onDislike}
        onFollow={onFollow}
        followedUsers={followedUsers}
        likedPosts={likedPosts}
        dislikedPosts={dislikedPosts}
        showTitle={false}
      />
    </div>
  );
}

export default Feed;