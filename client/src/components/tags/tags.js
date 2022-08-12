import React from "react";
import axios from "axios";

import "./tags.css";

import Categories from "../categories/categories";

function Tags({ categories, setCategoryNames }) {
  const handleKeydown = async (e) => {
    const catName = e.target.value;

    // - if enter key is pressed and category name is not empty create a new one
    if (e.key === "Enter" && catName.trim()) {
      await axios.post("/categories", { name: catName });
      // - set the array of category names to make a new post
      await setCategoryNames((prevCatNames) => {
        return [...prevCatNames, catName];
      });
      e.target.value = "";
    }
  };

  const handleRemoveTag = (indexRemove) => {
    setCategoryNames(categories.filter((category, i) => i !== indexRemove));
  };

  return (
    <div className="tags-input-container">
      <Categories categories={categories} onRemoveTag={handleRemoveTag} />
      <input
        type="text"
        className="tags-input"
        placeholder="Type your own tags"
        onKeyDown={handleKeydown}
      />
    </div>
  );
}

export default Tags;
