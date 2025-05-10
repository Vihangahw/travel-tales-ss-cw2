import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './components/NavBar';
import AuthForm from './components/AuthForm';
import SearchBar from './components/SearchBar';
import SortSelector from './components/SortSelector';
import PostList from './components/PostList';

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

  useEffect(() => {
    if (currentToken) {
      const decodedToken = JSON.parse(atob(currentToken.split('.')[1]));
      setLoggedInUserId(decodedToken.userId);
      fetchPosts();
    }
  }, [sortOption, currentToken]);

  const fetchPosts = (country = '', user = '') => {
    let url = `http://localhost:4000/blogs/all?sortBy=${sortOption}`;
    if (country || user) {
      url = `http://localhost:4000/blogs/search?searchCountry=${country}&searchUser=${user}`;
    }
    axios.get(url)
      .then(response => setPostList(response.data))
      .catch(error => console.error('Error fetching posts:', error));
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
    alert('Logged out successfully');
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
          <PostList posts={postList} />
        </>
      )}
    </div>
  );
}

export default App;