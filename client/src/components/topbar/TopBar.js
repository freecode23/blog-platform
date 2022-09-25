import "./topbar.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserDataContext } from "../../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { saveAs } from "file-saver";
import { axiosInstance } from "../../config";

export default function TopBar(props) {
    const { isAuthenticated, logout, loginWithRedirect } = useAuth0();


    const { userData } = useUserDataContext();
    const [resumeUrl, setResumeUrl] = useState("");

    // fetch user here to get link github, linkedin, and picture
    const handleLogout = async (event) => {
        event.preventDefault();
        logout({ returnTo: window.location.origin });
    };

    // set resume url
    useEffect(() => {
        const fetchResumeUrl = async () => {
            if (userData) {
                const res = await axiosInstance.post("/api/resume", { key: userData.resumeKey });

                if (res) {
                    setResumeUrl(res.data);
                }
            }
        };
        fetchResumeUrl();
    }, [userData]);

    const saveFile = () => {
        saveAs(resumeUrl, "SherlyHartono.pdf");
    };

    return (
        <div className="topAll">
            <div className="topDesc">
                <div className="topLeft">
                    {userData && (
                        <>
                            <a className="social link" href={userData.github}>
                                <i className="topSocialIcon fa-brands fa-github-square "></i>
                            </a>
                            <a className="social link" href={userData.linkedin}>
                                <i className="topSocialIcon fa-brands fa-linkedin"></i>
                            </a>
                        </>
                    )}
                </div>
                <div className="topCenter">
                    <div className="topCenterName">
                        Sherly Hartono
                    </div>
                    {
                        userData &&
                        <div className="topCenterDescription">
                            {userData.title}
                        </div>
                    }
                </div>

                <div className="topRight">
                    <Link className="social link" to={"/setting"}>
                        <i className="topSettingIcon fa-solid fa-user-astronaut fa-20x"></i>
                    </Link>
                    {isAuthenticated && userData ? (
                        <>
                            <p className="topLogoutButton"
                                onClick={handleLogout}>
                                logout
                            </p>
                        </>
                    ) : (
                        <button className="topLogoutButton"
                            onClick={async () => {
                                await loginWithRedirect();
                            }}>
                            Login
                        </button>
                    )}
                </div>
            </div>

            <div className="topMenu" >
                <ul className="topList">
                    <li className="topListItem">
                        <Link
                            className="link"
                            to={"/"}
                            onClick={props.scrollHomeHandler}>
                            HOME
                        </Link>
                    </li>
                    <li className="topListItem">
                        <p onClick={props.scrollContactHandler}>CONTACT</p>
                    </li>


                    <li className="topListItem">
                        <Link className="link" to={"/write"}>
                            WRITE
                        </Link>
                    </li>

                    {userData && (
                        <div className="topResume">
                            <li className="resume topListItem">
                                RESUME
                            </li>
                            <i className="download fa-solid fa-file-arrow-down" onClick={saveFile}>     </i>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
