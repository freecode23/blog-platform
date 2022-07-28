import React, { useEffect, useRef, useState } from "react";

import TopBar from "../topbar/TopBar";
import Contact from "../contact/Contact";
import Footer from "../footer/Footer";
import SnackBar from "../snackbar/Snackbar";


export default function Layout({ scrollHomeHandler, children }) {
  const contactRef = useRef()
  const [showSnackBar, setShowSnackbar] = useState(() => localStorage.getItem('snackbar'))


  function scrollToContactHandler() {
    contactRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  function closeSnackbarHandler() {
    localStorage.removeItem('snackbar');
    setShowSnackbar(false);
  }

  return (
    <>
      {showSnackBar && <SnackBar onClose={closeSnackbarHandler}>SnackBar Content</SnackBar>}
      {/* will go here if home is clicked */}
      <TopBar
        scrollContactHandler={scrollToContactHandler}
        scrollHomeHandler={scrollHomeHandler}
      />
      {children}

      {/* will go here if contact is clicked */}
      <div ref={contactRef}>
        <Contact />
      </div>
      <Footer />
    </>
  );
}
