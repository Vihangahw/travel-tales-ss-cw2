import { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';
import './Profile.css';

function Profile({ loggedInUserId, posts, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts, currentToken }) {
  const [userData, setUserData] = useState({ username: '', email: '', followers: [], followings: [] });

  useEffect(() => {
    if (loggedInUserId && currentToken) {
      axios.get(`http://localhost:4000/users/profile/${loggedInUserId}`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
        .then(response => {
          setUserData({
            username: response.data.username || 'User',
            email: response.data.email || 'user@example.com',
            followers: response.data.followers || [],
            followings: response.data.followings || []
          });
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          setUserData({ username: 'loading error', email: 'errorloading@example.com', followers: [], followings: [] });
        });
    }
  }, [loggedInUserId, currentToken]);

  const userPosts = posts.filter(post => post.user_id === loggedInUserId);

  return (
    <div className="profile-container">
      <div className="card shadow-sm profile-info">
        <div className="card-body">
          <h2 className="card-title text-center">{userData.username}</h2>
          <p className="card-text"><strong>Email:</strong> {userData.email}</p>
          <p className="card-text"><strong>Followers:</strong> {userData.followers.length}</p>
          <p className="card-text"><strong>Following:</strong> {userData.followings.length}</p>
        </div>
      </div>
      <h2 className="section-title mt-5">My Posts</h2>
      <PostList
        posts={userPosts}
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

export default Profile;