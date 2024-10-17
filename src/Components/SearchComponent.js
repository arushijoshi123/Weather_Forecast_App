"use client";
import React, { useState } from "react";
import "@/styles/SearchComponent.css";

const SearchComponent = ({ setCity }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    localStorage.setItem("lastSearchedCity", inputValue);
    setCity(inputValue);

    setInputValue("");
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        className="search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter city name"
        required
      />
      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchComponent;
