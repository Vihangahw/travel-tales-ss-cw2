import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/blogs/all')
      .then(response => setPostList(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      <h1>TravelTales</h1>
      <nav>
        <a href="/">Home</a> | <a href="/search">Search</a> | <a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/profile">Profile</a>
      </nav>
      <h2>Recent Posts</h2>
      {postList.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Country: {post.country_name}</p>
          <p>Visit Date: {post.visit_date}</p>
        </div>
      ))}
    </div>
  );
}

export default App;