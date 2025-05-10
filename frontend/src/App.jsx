import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [postList, setPostList] = useState([]);
  const [searchCountry, setSearchCountry] = useState('');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = (country = '', user = '') => {
    let url = 'http://localhost:4000/blogs/all';
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

  return (
    <div>
      <h1>TravelTales</h1>
      <nav>
        <a href="/">Home</a> | <a href="/search">Search</a> | <a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/profile">Profile</a>
      </nav>
      <div>
        <input
          type="text"
          placeholder="Search by country"
          value={searchCountry}
          onChange={(event) => setSearchCountry(event.target.value)}
        />
        <input
          type="text"
          placeholder="Search by username"
          value={searchUser}
          onChange={(event) => setSearchUser(event.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h2>Recent Posts</h2>
      {postList.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Country: {post.country_name}</p>
          <p>Visited Date: {post.visit_date}</p>
        </div>
      ))}
    </div>
  );
}

export default App;