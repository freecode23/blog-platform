import "./contact.css";
import React from "react";
import { useUserData } from "../../context/UserContext";


function Contact() {

  const { userData } = useUserData();
  return (
    <div className="contactContainer">
      <div className="contact">
        <p>Get in Touch!</p>

        {userData &&
          <>
            <a className="contactItem link"
              href={`mailto:${userData.email}?subject=Hi!`}>
              <i className="contactIcon fa fa-envelope"></i>
              <p className="contactContent">
                {userData.email}
              </p>
            </a>

            <a className="contactItem link"
              href="tel:480-678-0800">
              <i className="contactIcon fa fa-solid fa-phone"></i>
              <p className="contactContent">
                {userData.phone}
              </p>
            </a>

            <a className="contactItem link"
              href={`http://maps.google.com/?q=${userData.city}`}>
              <i className="contactIcon fa-solid fa-map-pin"></i>
              <p className="contactContent">
                {`${userData.address}, ${userData.city}`}
              </p>
            </a>
          </>
        }

      </div>
    </div>
  );
}

export default Contact;
