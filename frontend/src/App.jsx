import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import AuthForm from './components/AuthForm';
import SearchBar from './components/SearchBar';
import SortSelector from './components/SortSelector';
import PostList from './components/PostList';
import NewPost from './components/NewPost';
import UpdatePost from './components/UpdatePost';
import Welcome from './components/Welcome';
import Profile from './components/Profile';
import Feed from './components/Feed';
import SearchPage from './components/SearchPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function App() {
  const [postList, setPostList] = useState([]);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [currentToken, setCurrentToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [newPost, setNewPost] = useState({ postTitle: '', postContent: '', countryVisited: '', visitDate: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [reactions, setReactions] = useState({});
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dislikedPosts, setDislikedPosts] = useState(new Set());

  const updatePostRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();

    if (currentToken) {
      const decodedToken = JSON.parse(atob(currentToken.split('.')[1]));
      setLoggedInUserId(decodedToken.userId);
      fetchFollowedUsers();
      fetchUserReactions();
    }
  }, [sortOption, currentToken]);

  useEffect(() => {
    if (editingPost && updatePostRef.current) {
      updatePostRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingPost]);

  const fetchPosts = (country = '', user = '') => {
    let url = `http://localhost:4000/blogs/all?sortBy=${sortOption}`;
    if (country || user) {
      url = `http://localhost:4000/blogs/search?searchCountry=${country}&searchUser=${user}`;
    }
    axios.get(url)
      .then(response => {
        if (country || user) {
          setSearchResults(response.data);
        } else {
          setPostList(response.data);
        }
        response.data.forEach(post => {
          fetchReactions(post.id);
        });
      })
      .catch(error => console.error('Error fetching posts:', error));
  };

  const fetchReactions = (postId) => {
    axios.get(`http://localhost:4000/blogs/${postId}/reactions`)
      .then(response => {
        setReactions(prev => ({ ...prev, [postId]: response.data }));
      })
      .catch(error => console.error('Error fetching reactions:', error));
  };

  const fetchFollowedUsers = () => {
    axios.get('http://localhost:4000/users/following', {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(response => {
        const followedUserIds = new Set(response.data.map(user => user.followed_user_id));
        setFollowedUsers(followedUserIds);
      })
      .catch(error => console.error('Error fetching followed users:', error));
  };

  const fetchUserReactions = () => {
    if (!currentToken) return;
    postList.forEach(post => {
      axios.get(`http://localhost:4000/blogs/${post.id}/user-reaction`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      })
        .then(response => {
          if (response.data.reaction === 'like') {
            setLikedPosts(prev => new Set(prev).add(post.id));
          } else if (response.data.reaction === 'dislike') {
            setDislikedPosts(prev => new Set(prev).add(post.id));
          }
        })
        .catch(error => console.error('Error fetching user reaction:', error));
    });
  };

  const handleSearch = () => {
    fetchPosts(searchCountry, searchUser);
  };

  const handleAuth = () => {
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering
      ? { userEmail, userPassword, displayName }
      : { userEmail, userPassword };

    axios.post(`http://localhost:4000${endpoint}`, payload)
      .then(response => {
        if (!isRegistering) {
          const token = response.data.authToken;
          localStorage.setItem('token', token);
          setCurrentToken(token);
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setLoggedInUserId(decodedToken.userId);
          navigate('/');
        }
        setUserEmail('');
        setUserPassword('');
        setDisplayName('');
        setShowAuthForm(false);
      })
      .catch(error => {
        console.error('Auth error:', error);
        alert(error.response?.data?.error || 'Authentication failed');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentToken('');
    setLoggedInUserId(null);
    setFollowedUsers(new Set());
    setLikedPosts(new Set());
    setDislikedPosts(new Set());
    setShowAuthForm(false);
    navigate('/');
  };

  const handleCreatePost = () => {
    if (!currentToken) {
      alert('Please log in to create a post');
      return;
    }
    axios.post('http://localhost:4000/blogs/create', newPost, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        alert('Post created successfully');
        setNewPost({ postTitle: '', postContent: '', countryVisited: '', visitDate: '' });
        fetchPosts();
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to create post'));
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      postTitle: post.title,
      postContent: post.content,
      countryVisited: post.country_name,
      visitDate: post.visit_date
    });
    navigate('/');
  };

  const handleUpdatePost = () => {
    axios.put(`http://localhost:4000/blogs/${editingPost.id}`, newPost, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        setEditingPost(null);
        setNewPost({ postTitle: '', postContent: '', countryVisited: '', visitDate: '' });
        fetchPosts();
        navigate('/profile');
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to update post'));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`http://localhost:4000/blogs/${postId}`, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        fetchPosts();
        navigate('/profile');
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to delete post'));
  };

  const handleLike = (postId) => {
    axios.post(`http://localhost:4000/blogs/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(response => {
        fetchReactions(postId);
        if (response.data.message.includes('liked')) {
          setLikedPosts(prev => new Set(prev).add(postId));
          setDislikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        } else if (response.data.message.includes('removed')) {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to like post'));
  };

  const handleDislike = (postId) => {
    axios.post(`http://localhost:4000/blogs/${postId}/dislike`, {}, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(response => {
        fetchReactions(postId);
        if (response.data.message.includes('disliked')) {
          setDislikedPosts(prev => new Set(prev).add(postId));
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        } else if (response.data.message.includes('removed')) {
          setDislikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        }
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to dislike post'));
  };

  const handleFollowToggle = (targetId) => {
    if (!currentToken) {
      alert('Please log in to follow users');
      return;
    }

    const isFollowing = followedUsers.has(targetId);
    const endpoint = isFollowing ? `/users/unfollow/${targetId}` : `/users/follow/${targetId}`;
    const method = isFollowing ? 'delete' : 'post';

    axios({
      method: method,
      url: `http://localhost:4000${endpoint}`,
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        setFollowedUsers(prev => {
          const newFollowedUsers = new Set(prev);
          if (isFollowing) {
            newFollowedUsers.delete(targetId);
          } else {
            newFollowedUsers.add(targetId);
          }
          return newFollowedUsers;
        });
        fetchPosts();
      })
      .catch(error => alert(error.response?.data?.error || `Failed to ${isFollowing ? 'unfollow' : 'follow'} user`));
  };

  const isAuthenticated = !!currentToken;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">TravelTales</h1>
        <NavBar 
          isLoggedIn={isAuthenticated}
          onLogout={handleLogout}
          onLoginClick={() => { setIsRegistering(false); setShowAuthForm(true); }}
          onRegisterClick={() => { setIsRegistering(true); setShowAuthForm(true); }}
        />
      </header>

      <main className="app-main container">
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <div className="welcome-section">
                  <Welcome
                    recentPosts={postList}
                    popularPosts={postList}
                    loggedInUserId={loggedInUserId}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    reactions={reactions}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onFollow={handleFollowToggle}
                    followedUsers={followedUsers}
                    likedPosts={likedPosts}
                    dislikedPosts={dislikedPosts}
                    isRegistering={isRegistering}
                    userEmail={userEmail}
                    userPassword={userPassword}
                    displayName={displayName}
                    onEmailChange={setUserEmail}
                    onPasswordChange={setUserPassword}
                    onDisplayNameChange={setDisplayName}
                    onSubmit={handleAuth}
                    showAuthForm={showAuthForm}
                    setShowAuthForm={setShowAuthForm}
                  />
                </div>
              ) : (
                <div className="main-content">
                  {editingPost ? (
                    <div className="update-post-section" ref={updatePostRef}>
                      <UpdatePost
                        post={newPost}
                        onPostChange={setNewPost}
                        onSubmit={handleUpdatePost}
                        onCancel={() => setEditingPost(null)}
                      />
                    </div>
                  ) : (
                    <div className="new-post-section">
                      <NewPost
                        newPost={newPost}
                        onPostChange={setNewPost}
                        onSubmit={handleCreatePost}
                      />
                    </div>
                  )}
                  <div className="sort-section">
                    <SortSelector
                      sortOption={sortOption}
                      onSortChange={setSortOption}
                    />
                  </div>
                  <div className="post-list-section">
                    <PostList
                      posts={postList}
                      loggedInUserId={loggedInUserId}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                      reactions={reactions}
                      onLike={handleLike}
                      onDislike={handleDislike}
                      onFollow={handleFollowToggle}
                      followedUsers={followedUsers}
                      likedPosts={likedPosts}
                      dislikedPosts={dislikedPosts}
                    />
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="main-content">
                  <button onClick={() => navigate('/')} className="btn btn-back mb-3">
                    Back to Main
                  </button>
                  <Profile
                    loggedInUserId={loggedInUserId}
                    posts={postList}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    reactions={reactions}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onFollow={handleFollowToggle}
                    followedUsers={followedUsers}
                    likedPosts={likedPosts}
                    dislikedPosts={dislikedPosts}
                    currentToken={currentToken}
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <div className="main-content">
                  <button onClick={() => navigate('/')} className="btn btn-back mb-3">
                    Back to Main
                  </button>
                  <Feed
                    loggedInUserId={loggedInUserId}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                    reactions={reactions}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onFollow={handleFollowToggle}
                    followedUsers={followedUsers}
                    likedPosts={likedPosts}
                    dislikedPosts={dislikedPosts}
                    currentToken={currentToken}
                  />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <div className="main-content">
                <button onClick={() => navigate('/')} className="btn btn-back mb-3">
                  Back to Main
                </button>
                <SearchPage
                  searchCountry={searchCountry}
                  searchUser={searchUser}
                  onCountryChange={setSearchCountry}
                  onUserChange={setSearchUser}
                  onSearch={handleSearch}
                  searchResults={searchResults}
                  loggedInUserId={loggedInUserId}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  reactions={reactions}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onFollow={handleFollowToggle}
                  followedUsers={followedUsers}
                  likedPosts={likedPosts}
                  dislikedPosts={dislikedPosts}
                />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;