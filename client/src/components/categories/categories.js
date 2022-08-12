import React from "react";

function Categories({ categories, onRemoveTag }) {
  return categories.map((categoryName, index) => {
    return (
      <div className="tag-item" key={categoryName}>
        <span className="text">{categoryName}</span>
        <span className="close" onClick={() => onRemoveTag(index)}>
          &times;
        </span>
      </div>
    );
  });
}

export default Categories;
