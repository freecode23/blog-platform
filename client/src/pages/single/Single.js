import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlepost/SinglePost";
import "./single.css";
import React from "react";

export default function Single() {
  // Question. Want to do , if updateMode == true, dont do sidebar
  return (
    <div className="single">
      <SinglePost />
      <Sidebar />
    </div>
  );
}
