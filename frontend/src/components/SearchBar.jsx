function SearchBar({ searchCountry, searchUser, onCountryChange, onUserChange, onSearch }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search with Country Name"
        value={searchCountry}
        onChange={(event) => onCountryChange(event.target.value)}
      />
      <input
        type="text"
        placeholder="Search with Username"
        value={searchUser}
        onChange={(event) => onUserChange(event.target.value)}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;