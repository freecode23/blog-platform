import "./posts.css";
import CardPost from "../cardpost/CardPost";
import React from "react";

function Posts(props) {
  const postJSX = props.posts.map((post) => {
    return <CardPost key={post._id} post={post} />;
  });

  return <div className="posts">{postJSX}</div>;
}
export default Posts;
