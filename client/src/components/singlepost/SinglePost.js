import "./singlePost.css";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Froala from "../../components/editor/Froala";
import axios from "axios";
import DOMPurify from "dompurify";

function SinglePost() {
  // 1. Get the picture from local folder
  const awsS3Path = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/";
  const { user, isAuthenticated } = useAuth0();
  const [updateMode, setUpdateMode] = useState(false);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [signature, setSignature] = React.useState();
  const [editorContent, setEditorContent] = React.useState({
    model: "",
  });

  function handleEditorChange(editorData) {
    setEditorContent(editorData);
  }

  // - s3
  React.useEffect(() => {
    const getSignature = async () => {
      fetch("/get_signature")
        .then((r) => r.json())
        .then((data) => setSignature(data));
    };
    getSignature();
  }, []);

  // 2. get the id from the param so we can grab the data
  const param = useParams();
  const navigate = useNavigate();

  // 3. create posts fields
  const [post, setPost] = useState({
    title: "",
    picture: "",
    content: "",
    categories: [],
  });

  // 4. Init the post object, title, and the text area
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
      setCategories(res.data.categories)

      // fill in the value on textarea
      setEditorContent({ model: res.data.content });
    };

    // - call the function
    fetchPosts();
  }, [param.postId]);

  // 5. Delete the post using API
  const handleDelete = async (event) => {
    await axios.delete(param.postId);
    await navigate("/");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    await axios.put(param.postId, {
      username: user.username,
      title,
      content: editorContent,
    });
    await navigate("/");
  };


  const catJSXElements = categories.map(cat => {
    return (
      <span key={cat} className="postCat">
        {cat}
      </span>
    )
  })

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">

        {isAuthenticated && (
          <div className="singlePostEdit">
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

        {/* title */}
        {updateMode ? (
          <input
            className="singlePostTitleInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        ) : (

          <h1 className="singlePostTitle">
            {post.title}
          </h1>
        )}


        <div className="singlePostCatWrapper">
          {catJSXElements}
        </div>

        {/* image */}
        <img
          className="singlePostImg"
          src={awsS3Path + post.picture}
          alt=""
        />

        {/* Content */}
        {updateMode ? (
          <Froala
            editorContent={editorContent}
            handleEditorChange={handleEditorChange}
            imageUploadToS3={signature}
          />
        ) : (
          <div className="singlePostContent"
            dangerouslySetInnerHTML={
              //sanitize content and enforce style
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
            className="singlePostSubmit"
            onClick={handleUpdate}
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
