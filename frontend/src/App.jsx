import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './components/NavBar';
import AuthForm from './components/AuthForm';
import SearchBar from './components/SearchBar';
import SortSelector from './components/SortSelector';
import PostList from './components/PostList';
import NewPost from './components/NewPost';
import UpdatePost from './components/UpdatePost';

function App() {
  const [postList, setPostList] = useState([]);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentToken, setCurrentToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [newPost, setNewPost] = useState({ postTitle: '', postContent: '', countryVisited: '', visitDate: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [reactions, setReactions] = useState({});
  const [followedUsers, setFollowedUsers] = useState(new Set()); // New state to track followed users

  useEffect(() => {
    if (currentToken) {
      const decodedToken = JSON.parse(atob(currentToken.split('.')[1]));
      setLoggedInUserId(decodedToken.userId);
      fetchPosts();
      fetchFollowedUsers(); // Fetch followed users on login
    }
  }, [sortOption, currentToken]);

  const fetchPosts = (country = '', user = '') => {
    let url = `http://localhost:4000/blogs/all?sortBy=${sortOption}`;
    if (country || user) {
      url = `http://localhost:4000/blogs/search?searchCountry=${country}&searchUser=${user}`;
    }
    axios.get(url)
      .then(response => {
        setPostList(response.data);
        response.data.forEach(post => fetchReactions(post.id));
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
        }
        alert(isRegistering ? 'Registration successful' : 'Login successful');
        setUserEmail('');
        setUserPassword('');
        setDisplayName('');
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
    setFollowedUsers(new Set()); // Clear followed users on logout
    alert('Logged out successfully');
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
  };

  const handleUpdatePost = () => {
    axios.put(`http://localhost:4000/blogs/${editingPost.id}`, newPost, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        alert('Post updated successfully');
        setEditingPost(null);
        setNewPost({ postTitle: '', postContent: '', countryVisited: '', visitDate: '' });
        fetchPosts();
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to update post'));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`http://localhost:4000/blogs/${postId}`, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        alert('Post deleted successfully');
        fetchPosts();
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to delete post'));
  };

  const handleLike = (postId) => {
    axios.post(`http://localhost:4000/blogs/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        fetchReactions(postId);
        fetchPosts();
      })
      .catch(error => alert(error.response?.data?.error || 'Failed to like post'));
  };

  const handleDislike = (postId) => {
    axios.post(`http://localhost:4000/blogs/${postId}/dislike`, {}, {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(() => {
        fetchReactions(postId);
        fetchPosts();
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
            alert('User unfollowed');
          } else {
            newFollowedUsers.add(targetId);
            alert('User followed');
          }
          return newFollowedUsers;
        });
        fetchPosts(); // Refresh posts to ensure consistency
      })
      .catch(error => alert(error.response?.data?.error || `Failed to ${isFollowing ? 'unfollow' : 'follow'} user`));
  };

  return (
    <div>
      <h1>TravelTales</h1>
      <NavBar 
        isLoggedIn={!!currentToken}
        onLogout={handleLogout}
        onLoginClick={() => setIsRegistering(false)}
        onRegisterClick={() => setIsRegistering(true)}
      />

      {!currentToken && (
        <AuthForm
          isRegistering={isRegistering}
          userEmail={userEmail}
          userPassword={userPassword}
          displayName={displayName}
          onEmailChange={setUserEmail}
          onPasswordChange={setUserPassword}
          onDisplayNameChange={setDisplayName}
          onSubmit={handleAuth}
        />
      )}

      {currentToken && (
        <>
          {editingPost ? (
            <UpdatePost
              post={newPost}
              onPostChange={setNewPost}
              onSubmit={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
            />
          ) : (
            <NewPost
              newPost={newPost}
              onPostChange={setNewPost}
              onSubmit={handleCreatePost}
            />
          )}
          <SearchBar
            searchCountry={searchCountry}
            searchUser={searchUser}
            onCountryChange={setSearchCountry}
            onUserChange={setSearchUser}
            onSearch={handleSearch}
          />
          <SortSelector
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
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
          />
        </>
      )}
    </div>
  );
}

export default App;