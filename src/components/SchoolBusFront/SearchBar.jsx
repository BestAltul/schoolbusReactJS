import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder, onSearch }) => {
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="search-input::placeholder">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
