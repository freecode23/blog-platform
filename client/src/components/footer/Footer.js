import React from "react";
import { useUserDataContext } from "../../context/UserContext";
import "./footer.css";


function Footer() {
  const { userData } = useUserDataContext();
  return (
    <div className="footer">
      <p>Get in Touch!</p>
      {userData &&
        <>
          <a className="footerItem link"
            href={`mailto:${userData.email}?subject=Hi!`}>
            <i className="footerIcon fa fa-envelope"></i>
            <p className="footerContent">
              {userData.email}
            </p>
          </a>

          <a className="footerItem link"
            href="tel:480-678-0800">
            <i className="footerIcon fa fa-solid fa-phone"></i>
            <p className="footerContent">
              {userData.phone}
            </p>
          </a>

          <a className="footerItem link"
            href="https://www.instagram.com/shartono1/">
            <i className="footerIcon fa-brands fa-instagram"></i>
            <p className="footerContent">s.hartono1</p>
          </a>

          <a className="footerItem link"
            href={`http://maps.google.com/?q=${userData.city}`}>
            <i className="footerIcon fa-solid fa-map-pin"></i>
            <p className="footerContent">
              {`${userData.address}, ${userData.city}`}
            </p>
          </a>

          <p className="footerItem">
            ©Copyright All Rights Reserved
          </p>
        </>
      }
    </div >
  );
}

export default Footer;
