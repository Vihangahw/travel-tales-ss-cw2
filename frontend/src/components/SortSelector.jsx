function SortSelector({ sortOption, onSortChange }) {
  return (
    <div>
      <label>Sort by: </label>
      <select value={sortOption} onChange={(event) => onSortChange(event.target.value)}>
        <option value="newest">Newest</option>
        <option value="most-liked">Most Liked</option>
      </select>
    </div>
  );
}

export default SortSelector;