import React from "react";
import "./snackbar.css";

function SnackBar({ children, onClose }) {
  return (
    <div className="snackBar">
      <div className="snackBarContent">
        <p>
          {children}
        </p>
        <div className="snackbarCloseButton" onClick={onClose}>Close</div>
      </div>
    </div>
  );
}

export default SnackBar;
