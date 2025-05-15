import './SortSelector.css';

function SortSelector({ sortOption, onSortChange }) {
  return (
    <div className="sort-selector-container">
      <div className="input-group">
        <span className="input-group-text sort-label">Sort by:</span>
        <select value={sortOption} onChange={(event) => onSortChange(event.target.value)} className="form-select sort-select">
          <option value="newest">Newest</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>
    </div>
  );
}

export default SortSelector;