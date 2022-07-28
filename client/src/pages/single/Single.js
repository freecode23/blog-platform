import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlepost/SinglePost";
import "./single.css";
import React from "react";
import { useUpdateModeContext } from "../../context/UpdateModeContext";

export default function Single() {
  // Question. Want to do , if updateMode == true, dont do sidebar
  const { updateMode } = useUpdateModeContext();

  return (
    <div className="single">
      <SinglePost />

      {!updateMode && <Sidebar />}
    </div>
  );
}
