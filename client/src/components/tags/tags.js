import React from "react";
import { axiosInstance } from "../../config";

import "./tags.css";

import Categories from "../categories/categories";
import SnackBar from "../snackbar/Snackbar";

function Tags({ categories, setCategoryNames }) {
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState(null);

  // snackbar
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  function closeSnackbarHandler() {
    localStorage.removeItem('snackbar');
    setShowSnackbar(false);
  }

  const handleKeydown = async (e) => {
    const catName = e.target.value;

    // - if enter key is pressed and category name is not empty create a new one
    if (e.key === "Enter" && catName.trim()) {

      try {
        await axiosInstance.post("/api/categories", { name: catName });
        // - set the array of category names to make a new post
        await setCategoryNames((prevCatNames) => {
          return [...prevCatNames, catName];
        });
        e.target.value = "";
        setShowSnackbar(false);
        setSubmitErrorMsg("");

      } catch (err) {
        setSubmitErrorMsg(err.response.data.message);
        setShowSnackbar(true);
      }
    }
  };

  const handleRemoveTag = (indexRemove) => {
    setCategoryNames(categories.filter((category, i) => i !== indexRemove));
  };

  return (
    <>
      {showSnackbar && submitErrorMsg && (
        <SnackBar onClose={closeSnackbarHandler}>{submitErrorMsg}</SnackBar>
      )}
      <div className="tags-input-container">
        <Categories categories={categories} onRemoveTag={handleRemoveTag} />
        <input
          type="text"
          className="tags-input"
          placeholder="Type your own tags"
          onKeyDown={handleKeydown}
        />
      </div>


    </>
  );
}

export default Tags;
