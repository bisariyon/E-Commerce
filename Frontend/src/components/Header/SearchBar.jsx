import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Cancel } from "../../assets/imports/importImages";

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    setSearch(query);
  }, [location.search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      navigate(`/products`);
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() !== "") {
      navigate(`/products?query=${search}`);
    } else {
      navigate(`/products`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleClearClick = () => {
    setSearch("");
    navigate(`/products`);
  };

  return (
    <div className="flex-1 hidden sm:flex items-center rounded-full bg-white bg-opacity-10 mr-2">
      <button className="h-10 w-10 ml-3 av" onClick={handleSearchSubmit}>
        <img
          src="https://res.cloudinary.com/deepcloud1/image/upload/v1716378719/k2nuienbsmq25bwihp5r.png"
          alt="Search Icon"
          className="transition transform hover:scale-110 active:scale-95"
        />
      </button>
      <input
        type="text"
        className="flex-1 h-full p-2 bg-transparent outline-none text-white placeholder-gray-400 text-xl"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
      />
      {search.trim() !== "" && (
        <img
          src={Cancel}
          alt="Cancel Icon"
          className="h-12 w-12 mr-3 cursor-pointer"
          onClick={handleClearClick}
        />
      )}
    </div>
  );
}

export default SearchBar;
