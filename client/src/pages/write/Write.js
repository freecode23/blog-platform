import React from "react";
import { axiosInstance } from "../../config";

import Froala from "../../components/editor/Froala";
import SnackBar from "../../components/snackbar/Snackbar";
import Tags from "../../components/tags/tags";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbarContext } from "../../context/SnackbarContext";

import "./write.css";

function Write() {
  // 1. set the state that will be received by the UI
  // make sure the name is the same as the field name in the model
  // so that req.body works in API
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [categories, setCategoryNames] = useState([]);
  const [file, setFile] = useState(null); // the actual picture file
  const [signature, setSignature] = React.useState();
  const [editorContent, setEditorContent] = React.useState({
    model: "",
  });
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState(null);
  const {
    showSnackbar,
    setShowSnackbar,
    closeSnackbarHandler,
  } = useSnackbarContext();

  function handleEditorChange(editorData) {
    setEditorContent(editorData);
  }

  // 2. get signature and set so we can access s3
  React.useEffect(() => {
    // const getSignature = async () => {
    //   fetch("/api/get_signature")
    //     .then((r) => r.json())
    //     .then((data) => setSignature(data));
    // };

    const getSignature = async () => {
      const res = await axiosInstance.get("/api/get_signature")
      setSignature(res.data)
    };
    setShowSnackbar(false);
    getSignature();
  }, []);

  // 3. When publish is clicked
  const handleSubmit = async (event) => {
    event.preventDefault();

    // - create newpost with the editor state
    const newPost = {
      title,
      content: editorContent,
      categories,
    };

    // - add big photo if file exists - will be set by the JSX
    if (file) {
      const filename = Date.now() + file.name;
      // - create a new form data
      const formData = new FormData();
      formData.append("name", filename);
      formData.append("file", file);

      // - upload big photo
      try {
        const res = await axiosInstance.post("/api/upload", formData);
        newPost.picture = res.data.key;
      } catch (err) {
        setSubmitErrorMsg("Cannot upload photo");
        setShowSnackbar(true);
      }
    } else {
      setSubmitErrorMsg("Please upload a photo for the post");
      setShowSnackbar(true);
    }

    // - create the blogpost in Mongo
    try {
      const res = await axiosInstance.post("/api/blogposts", newPost);
      res.data && navigate("/blogposts/" + res.data._id);
      setShowSnackbar(false);
    } catch (err) {
      setSubmitErrorMsg(err.response.data.message);
      setShowSnackbar(true);
    }
  };

  // 4. create initial tags using existing categories
  // - Init categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axiosInstance.get("/api/categories");

      setCategoryNames(() => {
        return res.data.map((category) => {
          return category.name;
        });
      });
    };
    fetchCategories();
  }, []);

  return (
    <div className="write">
      {showSnackbar && (
        <SnackBar onClose={closeSnackbarHandler}>{submitErrorMsg}</SnackBar>
      )}
      <div className="writeTitle">
        <span>Write a post</span>
      </div>
      <form className="writeForm">
        {/* Image */}
        <div className="writeFormItem">
          <label>Blog Picture:</label>
          <div className="writeInput">
            <label htmlFor="fileInput">
              <i className="writeIcon fas fa-plus"></i>
            </label>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            {file && <img src={URL.createObjectURL(file)} alt="" />}
          </div>
        </div>

        {/* Title */}
        <div className="writeFormItem">
          <label>Title</label>
          <div className="writeInput">
            <input
              className="writeInputTitle"
              placeholder="Some title here"
              type="text"
              autoFocus={true}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="writeFormItem">
          <label>Tags</label>
          <div className="writeInput">
            <Tags categories={categories} setCategoryNames={setCategoryNames} />
          </div>
        </div>

        {/* Editor */}
        <div className="writeFormItem">
          <label>Content</label>
          <div className="writeInput">
            <Froala
              editorContent={editorContent}
              handleEditorChange={handleEditorChange}
              imageUploadToS3={signature}
            />
          </div>
        </div>

        <button
          type="button"
          className="writeSubmitButton"
          onClick={handleSubmit}
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default Write;
