import "./sidebar.css";
import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../../context/Context";
import axios from "axios";


function Sidebar() {
    // 1. variables
    const [cats, setCats] = useState([]);
    const { userData } = useUserData();
    const publicFolderPath = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/"
    
    // 2. Init categories and about from DB
    useEffect(() => {

        // - categories
        const fetchCats = async () => {
            // request to API: "localhost::4000/api/ + "/categories"
            // response to : localhost::3000/...
            const res = await axios.get("/categories");

            setCats(res.data);
        };
        fetchCats();


    }, []);

    // 3. Create list of categories JSX with a link to home page with category filtered
    const catsJSX = cats.map((cat) => {
        const catName = encodeURIComponent(cat.name)

        return (
            <Link to={'/?cat=' + catName.toString()}
            className="link">
                <li key={cat._id} className="sidebarListItem">
                    {cat.name}
                </li>
            </Link>
        );
    });


    return (
        <aside className="sidebar">
            <div className="sidebarItem">
    
                {userData && 
                    <>
                        <img className="sidebarImg"
                        src={publicFolderPath + userData.profilePic}
                        alt="sherly" />

                        <p>{userData.about}</p>
                    </>
                }

            </div>
            <div className="sidebarItem">
                <span className="sidebarTitle">Categories</span>
                <ul className="sidebarList">{catsJSX}</ul>
            </div>
        </aside>
    );
}
export default Sidebar;