import { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdatePost.css';

function UpdatePost({ post, onPostChange, onSubmit, onCancel }) {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/api/countries')
      .then(response => {
        console.log('API Response:', response.data);
        setCountries(response.data);
        setFilteredCountries(response.data);
        setIsLoaded(true);
        console.log('Countries State After Set:', response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setErrorMessage('Failed to fetch countries');
        setCountries([]);
        setFilteredCountries([]);
        setIsLoaded(true);
      });
  }, []);

  const handleCountryInputChange = (event) => {
    const input = event.target.value;
    onPostChange({ ...post, countryVisited: input });

    if (input.trim() === '') {
      setFilteredCountries(countries);
      setShowSuggestions(false);
    } else {
      const filtered = countries.filter(country =>
        country.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowSuggestions(true);
    }
  };

  const handleCountrySelect = (country) => {
    onPostChange({ ...post, countryVisited: country });
    setShowSuggestions(false);
  };

  return (
    <div className="update-post-container">
      <div className="card shadow-sm update-post">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Edit Post</h2>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Title"
              value={post.postTitle}
              onChange={(event) => onPostChange({ ...post, postTitle: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Content"
              value={post.postContent}
              onChange={(event) => onPostChange({ ...post, postContent: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="mb-3 country-input-container">
            <input
              type="text"
              placeholder="Type a country"
              value={post.countryVisited}
              onChange={handleCountryInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="form-control update-post-input"
            />
            {showSuggestions && filteredCountries.length > 0 && (
              <ul className="country-suggestions">
                {filteredCountries.map((country, index) => (
                  <li
                    key={index}
                    onMouseDown={() => handleCountrySelect(country)}
                    className="country-suggestion-item"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
            {showSuggestions && filteredCountries.length === 0 && post.countryVisited.trim() !== '' && (
              <div className="no-suggestions">No matching countries found</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="date"
              value={post.visitDate}
              onChange={(event) => onPostChange({ ...post, visitDate: event.target.value })}
              className="form-control update-post-input"
            />
          </div>
          <div className="d-flex gap-2">
            <button onClick={onSubmit} className="btn btn-update w-50">
              Update Post
            </button>
            <button onClick={onCancel} className="btn btn-cancel w-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;