import React, { useRef } from "react";

import TopBar from "../topbar/TopBar";
import Contact from "../contact/Contact";

export default function Layout({ scrollHomeHandler, children }) {
  const contactRef = useRef()

  function scrollToContactHandler() {
    contactRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
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
    </>
  );
}
