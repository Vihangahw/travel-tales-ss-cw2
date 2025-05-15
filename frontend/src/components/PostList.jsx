import { useState } from 'react';
import axios from 'axios';
import PostInteraction from './PostInteraction';
import './PostList.css';

function PostList({ posts, loggedInUserId, onEdit, onDelete, reactions, onLike, onDislike, onFollow, followedUsers, likedPosts, dislikedPosts, showTitle = true }) {
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [countryInfo, setCountryInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleToggleExpand = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleViewCountryInfo = (countryName) => {
    if (countryName === selectedCountry) {
      setCountryInfo(null);
      setSelectedCountry(null);
      setErrorMessage(null);
    } else {
      axios.get(`http://localhost:4000/api/country/${countryName}`)
        .then(response => {
          console.log('Country Info Response:', response.data);
          setCountryInfo(response.data);
          setSelectedCountry(countryName);
          setErrorMessage(null);
        })
        .catch(error => {
          console.error('Error fetching country info:', error);
          setErrorMessage('Failed to fetch country info');
          setCountryInfo(null);
          setSelectedCountry(null);
        });
    }
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
                    {errorMessage && selectedCountry === post.country_name && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    <button
                      onClick={() => handleViewCountryInfo(post.country_name)}
                      className="btn btn-info mt-2 mb-2"
                    >
                      {selectedCountry === post.country_name && countryInfo ? 'Hide Country Info' : 'View Country Info'}
                    </button>
                    {selectedCountry === post.country_name && countryInfo && (
                      <div className="country-info mb-3">
                        <img src={countryInfo.flag} alt={`${countryInfo.name} flag`} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
                        <p><strong>Currency:</strong> {countryInfo.currency}</p>
                        <p><strong>Capital:</strong> {countryInfo.capital}</p>
                        <p><strong>Languages:</strong> {countryInfo.languages}</p> {/* Add languages */}
                      </div>
                    )}
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