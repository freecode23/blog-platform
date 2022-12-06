import "./singlePost.css";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUpdateModeContext } from "../../context/UpdateModeContext";
import { axiosInstance } from "../../config";
import CommentForm from "../../components/comments/CommentForm";
import Comments from "../../components/comments/Comments";
import SnackBar from "../snackbar/Snackbar";
import Froala from "../editor/Froala";
import Tags from "../tags/tags";
import DOMPurify from "dompurify";
import useUnmount from "../../hooks/useUnmount";
import { Discovery } from "aws-sdk";


function SinglePost() {
  // 1. Get the picture from local folder
  const awsS3Path = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/";
  // 2. States and hooks
  const [submittedId, setSubmittedId] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const { updateMode, setUpdateMode } = useUpdateModeContext();
  const [title, setTitle] = useState("");
  const [github, setGithub] = useState("");
  const [categories, setCategoryNames] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [signature, setSignature] = React.useState();
  const [editorContent, setEditorContent] = React.useState({
    model: "",
  });
  const [submitErrorMsg, setSubmitErrorMsg] = React.useState(null);

  const [showSnackbar, setShowSnackbar] = React.useState(false);
  function closeSnackbarHandler() {
    localStorage.removeItem('snackbar');
    setShowSnackbar(false);
  }

  // 3. create updated Post
  const [post, setPost] = useState({
    title: "",
    github: "",
    picture: "",
    content: "",
    categories: [],
    comments: []
  });

  // 4. get the id from the param of this blogpost page so we can grab the data
  const param = useParams();
  const navigate = useNavigate();

  // 5. use Effect for s3
  useEffect(() => {
    const getSignature = async () => {
      const res = await axiosInstance.get("/api/get_signature")
      setSignature(res.data)
    };
    getSignature();
  }, []);

  // fetch Post object, title, and text area
  useEffect(() => {
    const fetchPosts = async () => {
      // - if we write "/blogposts" it will make get request to
      // "localhost::4000/api/ + "blogposts /:postId"

      // - if we wrote "blogposts" it will make get request to:
      // will take the current browser path and append blogposts
      // "localhost::4000/api/blogposts/ + "blogposts /:postId"
      const res = await axiosInstance.get("/api/blogposts/" + param.postId);

      setPost(res.data);
      setTitle(res.data.title);
      if (res.data.github) {
        setGithub(res.data.github);
      }
      setCategoryNames(res.data.categories);
      setLikes(res.data.likes)

      // fill in the value on textarea
      setEditorContent({ model: res.data.content });
    };

    // - call the function
    fetchPosts();
  }, [param.postId]);

  // fetch Comments 
  useEffect(() => {
    const fetchComments = async () => {
      const res = await axiosInstance.get("/api/blogposts/" + param.postId);
      if (res.data) {
        setComments(res.data.comments);
      }
    };
    fetchComments()

  }, []);

  // Navigate to /
  React.useEffect(() => {
    if (submittedId) {
      // console.log("submittedId", submittedId);
      navigate("/");
    }
  }, [submittedId]);

  // 5. Remove unpublihsed froala images on unmount
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

  // 6. handler
  // - editor
  function handleEditorChange(editorData) {

    setEditorContent(editorData);
  }

  // - delete the post using API
  const handleDelete = async (event) => {
    const res = await axiosInstance.delete("/api/blogposts/" + param.postId);

    // delete small pictures from s3
    await navigate("/");
  };

  // - edit
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const res = await axiosInstance.put("/api/blogposts/" + param.postId, {
        username: user.username,
        categories,
        title,
        content: editorContent,
      });


      if (res.data) {
        setUpdateMode(false);
        setShowSnackbar(false);
        setSubmitErrorMsg("");
        setSubmittedId(res.data._id);
        localStorage.setItem("froalaImages", JSON.stringify([]))
      }
      // res.data && navigate("/");
    } catch (err) {
      setSubmitErrorMsg(err.response.data.message);
      setShowSnackbar(true);
    }
  };

  const handleAddLikes = async (event) => {
    event.preventDefault();
    try {
      const res = await axiosInstance.put("/api/blogposts/likes/" + param.postId, {});
      res.data && setLikes(res.data.likes)
    } catch (err) {
      console.log(err)
    }
  }

  // 7. categories JSX , just display
  const catJSX = categories.map((cat) => {
    return (
      <span key={cat} className="postCat">
        {cat}
      </span>
    );
  });

  // 8. github jsx
  const githubJSX = () => {
    if (github !== "") {
      return <a className="social link" href={github}>
        <i className="singlePostSocialIcon fa-brands fa-github"></i>
      </a>
    } else {
      return <div></div>
    }
  }

  return (
    <div className="singlePost">
      {showSnackbar && submitErrorMsg && (
        <SnackBar onClose={closeSnackbarHandler}>{submitErrorMsg}</SnackBar>
      )}

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
      <div className={updateMode ? "singlePostForm" : ""}>
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
              />
            </div>
            <label>Github repo</label>
            <div className="singlePostInput">
              <input
                className="singlePostInputTitle"
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="singlePostTitle">{post.title}

            </h1>
          </div>


        )}

        {/* Github */}
        {/* {
          updateMode ? (
            <div className="singlePostFormItem">
              <label>Github repo</label>
              <div className="singlePostInput">
                <input
                  className="singlePostInputTitle"
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div> {githubJSX()}</div>)
        } */}

        {/* Tags */}
        {updateMode ? (
          <div className="singlePostFormItem">
            <label>Tags</label>
            <div className="singlePostInput">
              <Tags
                categories={categories}
                setCategoryNames={setCategoryNames}
              />
            </div>
          </div>
        ) : (
          <div className="singlePostCatWrapper">{catJSX} {githubJSX()}</div>
        )}

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
          <div
            className="singlePostContent"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content, {
                FORCE_BODY: true,
                ALLOWED_TAGS: ["iframe", "img", "br", "p", "span", "li", "a"],
              }),
            }}
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


      {/* Likes */}
      <div className="singlePostLikes">
        <i
          className="singlePostLikesIcon fa-solid fa-hands-clapping"
          onClick={handleAddLikes}
        ></i>
        {likes > 0 && (
          <p className="singlePostLikesCounter">{likes}</p>
        )}
      </div>

      {/* Comments */}
      {
        !updateMode && (
          <div className="singlePostCommentWrapper">
            <div className="singlePostComments">
              <Comments comments={comments} />
            </div>
            <div className="singlePostCommentForm">
              <CommentForm postId={param.postId} setComments={setComments} />
            </div>
          </div>
        )

      }
    </div >
  );
}

export default SinglePost;
