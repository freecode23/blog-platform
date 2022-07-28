import React from "react";
import { useUserData } from "../../context/UserContext";
import "./footer.css";


function Footer() {
  const { userData } = useUserData();
  return (
    <div className="footer">

      {userData &&
        <>
          <a className="footerItem link"
            href="https://www.instagram.com/shartono1/">
            <i class="footerIcon fa-brands fa-instagram"></i>
          </a>
          <a className="footerItem">
            ©Copyright All Rights Reserved
          </a>
        </>
      }
    </div >
  );
}

export default Footer;
