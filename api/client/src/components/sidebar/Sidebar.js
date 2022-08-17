import "./sidebar.css";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserDataContext } from "../../context/UserContext";
// import axios from "axios";
import { axiosInstance } from "../../config";

function Sidebar() {
  // 1. variables
  const [cats, setCats] = useState([]);
  const { userData } = useUserDataContext();
  const awsS3Path = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/";

  // 2. Init categories and about from DB
  useEffect(() => {
    // - categories
    const fetchCats = async () => {
      // request to API: "localhost::4000/api/ + "/categories"
      // response to : localhost::3000/...
      const res = await axiosInstance.get("/api/categories");

      setCats(res.data);
    };
    fetchCats();
  }, []);

  // 3. Create list of categories JSX with a link to home page with category filtered
  const catsJSX = cats.map((cat) => {
    const catName = encodeURIComponent(cat.name);

    return (
      <Link to={"/?cat=" + catName.toString()} className="link" key={cat._id}>
        <li className="sidebarSkillItem">
          <p className="sidebarSkillText">
            {cat.name}
          </p>
        </li>
      </Link>
    );
  });

  return (
    <aside className="sidebar">
      <div className="sidebarItem">
        {userData && (
          <>
            <img
              className="sidebarImg"
              src={awsS3Path + userData.profilePic}
              alt="sherly"
            />

            <p className="sidebarAbout">{userData.about}</p>
          </>
        )}
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">Skills</span>
        <ul className="sidebarSkill">{catsJSX}</ul>
      </div>
    </aside>
  );
}
export default Sidebar;
