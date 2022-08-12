import "./singlePost.css";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUpdateModeContext } from "../../context/UpdateModeContext";
import { useSnackbarContext } from "../../context/SnackbarContext";
import SnackBar from "../../components/snackbar/Snackbar";
import TagsInput from "../../components/tagsInput/tagsInput";
import Froala from "../../components/editor/Froala";
import axios from "axios";
import DOMPurify from "dompurify";

function SinglePost() {
  // 1. Get the picture from local folder
  const awsS3Path = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/";

  // 2. States and hooks
  const { user, isAuthenticated } = useAuth0();
  const { updateMode, setUpdateMode } = useUpdateModeContext();
  const [title, setTitle] = useState("");
  const [categories, setCategoryNames] = useState([]);
  const [signature, setSignature] = React.useState();
  const [editorContent, setEditorContent] = React.useState({
    model: "",
  });
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState(null)
  const { showSnackbar, setShowSnackbar, closeSnackbarHandler } = useSnackbarContext();

  // 3. create updated Post
  const [post, setPost] = useState({
    title: "",
    picture: "",
    content: "",
    categories: [],
  });

  // 4. get the id from the param so we can grab the data
  const param = useParams();
  const navigate = useNavigate();

  // 5. use Effect for s3
  React.useEffect(() => {
    const getSignature = async () => {
      fetch("/get_signature")
        .then((r) => r.json())
        .then((data) => setSignature(data));
    };
    getSignature();
  }, []);

  // use Effect to fetch and init the post object, title, and the text area
  useEffect(() => {
    const fetchPosts = async () => {
      // - if we write "/blogposts" it will make get request to
      // "localhost::4000/api/ + "blogposts /:postId"

      // - if we wrote "blogposts" it will make get request to:
      // will take the current browser path and append blogposts
      // "localhost::4000/api/blogposts/ + "blogposts /:postId"
      const res = await axios.get("/blogposts/" + param.postId);
      setPost(res.data);
      setTitle(res.data.title);
      setCategoryNames(res.data.categories)

      // fill in the value on textarea
      setEditorContent({ model: res.data.content });
    };

    // - call the function
    fetchPosts();
  }, [param.postId]);



  // 6. handler 
  // - editor
  function handleEditorChange(editorData) {
    setEditorContent(editorData);
  }

  // - delete the post using API
  const handleDelete = async (event) => {
    await axios.delete(param.postId);
    await navigate("/");
  };


  // - edit
  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log("try update");

    try {
      const res = await axios.put(param.postId, {
        username: user.username,
        categories,
        title,
        content: editorContent,
      });
      setUpdateMode(false)
      setShowSnackbar(false)
      res.data && navigate("/");

    } catch (err) {
      setSubmitErrorMsg(err.response.data.message)
      setShowSnackbar(true)
    }
  };

  // - submit
  // >>>>>>>>>>>>Questions: Repeat this from write.js 
  // create category elementes?
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

  const removeTag = (indexRemove) => {
    setCategoryNames(categories.filter((category, i) => i !== indexRemove));
  };

  // - Create the tag JSX of the category using the names array
  const catsJSXTag = categories.map((categoryName, index) => {
    return (
      <div className="tag-item" key={categoryName}>
        <span className="text">{categoryName}</span>
        <span className="close" onClick={() => removeTag(index)}>
          &times;
        </span>
      </div>
    );
  });

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // 7. categories JSX , just display
  const catJSX = categories.map(cat => {
    return (
      <span key={cat} className="postCat">
        {cat}
      </span>
    )
  })


  return (
    <div className="singlePost">
      {showSnackbar &&
        <SnackBar onClose={closeSnackbarHandler}>
          {submitErrorMsg}
        </SnackBar>}

      {/* Menu Title */}
      {updateMode && (
        <div className="singlePostMenuTitle">
          <span>Update Post</span>
        </div>
      )}

      {/* Icons */}
      {isAuthenticated && (
        <div className="singlePostIcons">
          <i
            className="singlePostIcon far fa-edit"
            onClick={() => setUpdateMode(true)}
          ></i>
          <i
            className="singlePostIcon far fa-trash-alt"
            onClick={handleDelete}
          ></i>
        </div>
      )}

      {/* The Post */}
      <div className={updateMode ? ("singlePostForm") : ("")}>
        {/* Title */}
        {updateMode ? (
          <div className="singlePostFormItem">
            <label>Title</label>
            <div className="singlePostInput">
              <input
                className="singlePostInputTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              /></div>
          </div>
        ) : (
          <h1 className="singlePostTitle">
            {post.title}
          </h1>
        )}

        {/* Tags */}
        {updateMode ?
          (
            <div className="singlePostFormItem">
              <label>Tags</label>
              <div className="singlePostInput">
                <TagsInput catsJSX={catsJSXTag} onKeyDown={handleKeydown} />
              </div>
            </div>)
          :
          (<div className="singlePostCatWrapper">
            {catJSX}
          </div>)}


        {/* Image */}
        <div className="singlePostInput">
          <img
            className="singlePostImg"
            src={awsS3Path + post.picture}
            alt=""
          />
        </div>

        {/* Content */}
        {updateMode ? (
          <div className="singlePostFormItem">
            <label>Content</label>
            <div className="singlePostInput">
              <Froala
                editorContent={editorContent}
                handleEditorChange={handleEditorChange}
                imageUploadToS3={signature}
              />
            </div>
          </div>
        ) : (
          <div className="singlePostContent"
            dangerouslySetInnerHTML={
              {
                __html: DOMPurify.sanitize(post.content, {
                  FORCE_BODY: true,
                }),
              }
            }
          ></div>
        )}

        {updateMode && (
          <button
            type="button"
            className="singlePostSubmitButton"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </div>
    </div >
  );
}

export default SinglePost;
