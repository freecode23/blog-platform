import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlepost/SinglePost";
import "./single.css";
import React from "react";
import { useUpdateModeContext } from "../../context/UpdateModeContext";

export default function Single() {
  const { updateMode } = useUpdateModeContext();

  return (
    <div className="single">
      <SinglePost />
      {!updateMode && <Sidebar />}
    </div>
  );
}
