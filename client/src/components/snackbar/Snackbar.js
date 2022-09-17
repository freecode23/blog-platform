import React from "react";
import "./snackbar.css";

function SnackBar({ children, onClose }) {
  console.log('children::', children);
  return (
    <div className="snackBar">
      <div className="snackBarContent">
        <p>
          {children}
        </p>
        <div className="snackbarCloseButton" onClick={onClose}>X</div>
      </div>
    </div>
  );
}

export default SnackBar;
