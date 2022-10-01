import React from "react";
import { axiosInstance } from "../../config";

import Froala from "../../components/editor/Froala";
import SnackBar from "../../components/snackbar/Snackbar";
import Tags from "../../components/tags/tags";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUnmount from "../../hooks/useUnmount";

import "./write.css";

function Write() {
  // 1. set the state that will be received by the UI
  // make sure the name is the same as the field name in the model
  // so that req.body works in API
  const navigate = useNavigate();
  const [submittedId, setSubmittedId] = useState(null);
  const [title, setTitle] = useState("");
  const [categories, setCategoryNames] = useState([]);
  const [file, setFile] = useState(null); // the actual picture file
  const [signature, setSignature] = React.useState();
  const [editorContent, setEditorContent] = React.useState({
    model: "",
  });
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  function closeSnackbarHandler() {
    localStorage.removeItem("snackbar");
    setShowSnackbar(false);
  }

  // 2. Init tags using existing categories
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

  // 3. Init signature and set so we can access s3
  React.useEffect(() => {
    const getSignature = async () => {
      const res = await axiosInstance.get("/api/get_signature");
      setSignature(res.data);
    };
    setShowSnackbar(false);
    setSubmitErrorMsg("");
    getSignature();
  }, []);

  // 4. Remove unpublihsed froala images on unmount
  useUnmount(() => {
    if (!submittedId) {
      // A. create the delete function
      const deleteUnpublishedImagesS3 = async (images) => {
        const res = await axiosInstance.delete("/api/blogposts/unpublished", {
          data: { images: images },
        });
      };

      // B. grab the images from local storage
      const unpublishedImages = JSON.parse(
        localStorage.getItem("froalaImages")
      );

      // C. delete from s3 and from localStorage
      deleteUnpublishedImagesS3(unpublishedImages);
      localStorage.setItem("froalaImages", JSON.stringify([]));
    }
  });

  React.useEffect(() => {
    if (submittedId) {
      console.log("submittedId", submittedId);
      navigate("/blogposts/" + submittedId);
    }
  }, [submittedId]);

  // 5. Handlers:
  function handleEditorChange(editorData) {
    setEditorContent(editorData);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // - check if adding froala pictures
    const images_arr = JSON.parse(localStorage.getItem("froalaImages"));

    // - create newpost with the editor state
    const newPost = {
      title,
      content: editorContent,
      categories,
      pictures: images_arr,
      likes: 0,
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

      if (res.data) {
        setSubmittedId(res.data._id);
        setShowSnackbar(false);
        setSubmitErrorMsg("");
      }
    } catch (err) {
      setSubmitErrorMsg(err.response.data.message);
      setShowSnackbar(true);
    }
  };

  return (
    <div className="write">
      {showSnackbar && submitErrorMsg && (
        <SnackBar onClose={closeSnackbarHandler}>
          <p>{submitErrorMsg}</p>
        </SnackBar>
      )}
      {/* <SnackBar onClose={closeSnackbarHandler}>{submitErrorMsg}</SnackBar> */}
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
