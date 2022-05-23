const Filter = ({ search, onSearchChange }) => (
  <div>
    filter shown with <input value={search} onChange={onSearchChange} />
  </div>
);

export default Filter;
