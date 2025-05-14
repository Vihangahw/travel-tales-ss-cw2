import { useState, useEffect } from 'react';
import axios from 'axios';
import './NewPost.css';

function NewPost({ newPost, onPostChange, onSubmit }) {
  const [showForm, setShowForm] = useState(false);
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
    onPostChange({ ...newPost, countryVisited: input });

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
    onPostChange({ ...newPost, countryVisited: country });
    setShowSuggestions(false);
  };

  return (
    <div className="new-post-container">
      <button onClick={() => setShowForm(!showForm)} className="btn btn-create-post mb-3">
        {showForm ? 'Cancel' : 'Create Post'}
      </button>
      {showForm && isLoaded && (
        <div className={`card shadow-sm new-post ${showForm ? 'expanded' : ''}`}>
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Create Post</h2>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Title"
                value={newPost.postTitle}
                onChange={(event) => onPostChange({ ...newPost, postTitle: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Content"
                value={newPost.postContent}
                onChange={(event) => onPostChange({ ...newPost, postContent: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <div className="mb-3 country-input-container">
              <input
                type="text"
                placeholder="Type a country"
                value={newPost.countryVisited}
                onChange={handleCountryInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="form-control new-post-input"
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
              {showSuggestions && filteredCountries.length === 0 && newPost.countryVisited.trim() !== '' && (
                <div className="no-suggestions">No matching countries found</div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="date"
                value={newPost.visitDate}
                onChange={(event) => onPostChange({ ...newPost, visitDate: event.target.value })}
                className="form-control new-post-input"
              />
            </div>
            <button onClick={onSubmit} className="btn btn-create w-100">
              Create Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewPost;