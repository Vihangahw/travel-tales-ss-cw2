import './SearchBar.css';

function SearchBar({ searchCountry, searchUser, onCountryChange, onUserChange, onSearch }) {
  return (
    <div className="search-bar-container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Country"
          value={searchCountry}
          onChange={(event) => onCountryChange(event.target.value)}
          className="form-control search-input me-2"
        />
        <input
          type="text"
          placeholder="Username"
          value={searchUser}
          onChange={(event) => onUserChange(event.target.value)}
          className="form-control search-input me-2"
        />
        <button onClick={onSearch} className="btn btn-search">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;