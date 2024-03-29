import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserDataContext } from "../../context/UserContext";
import "./setting.css";
import { axiosInstance } from "../../config";

function Setting() {
  // 1. Get the picture from local folder
  const { user } = useAuth0();
  const { userData, setUserData } = useUserDataContext();
  const navigate = useNavigate();

  // 1. JSX variables
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");


  // 2. update at init
  useEffect(() => {
    // - get User from context to prepopulate field
    if (userData) {
      setName(userData.username);
      setEmail(userData.email);
      setAbout(userData.about);
      setLinkedin(userData.linkedin);
      setGithub(userData.github);
      setPhone(userData.phone);
      setAddress(userData.address);
      setCity(userData.city);
      setTitle(userData.title);
    }
  }, [userData]);

  // 3. When Update is clicked
  const handleSubmit = async (event) => {
    event.preventDefault();

    // - create new or updated user
    const updatedUser = {
      username,
      email,
      about,
      linkedin,
      github,
      phone,
      address,
      city,
      title,
      sub: user.sub,
    };
    // - add profile pic if its added
    if (profilePic) {
      const filename = Date.now() + profilePic.name;
      const formData = new FormData();
      formData.append("name", filename);
      formData.append("file", profilePic);

      try {
        const res = await axiosInstance.post("/api/upload", formData);
        updatedUser.profilePic = res.data.key;
      } catch (err) {
        console.log(err);
      }
    }

    // - add resume if added
    if (resume) {
      const filename = resume.name;
      const formData = new FormData();
      formData.append("name", filename);
      formData.append("file", resume);

      try {
        const res = await axiosInstance.post("/api/upload", formData);
        updatedUser.resumeKey = res.data.key;
      } catch (err) {
        console.log(err);
      }
    }

    // - update the user
    try {
      const res = await axiosInstance.post("/api/users", updatedUser);
      setUserData(res.data);
      res.data && navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="setting">
      <div className="settingWrapper">
        {/* Title*/}
        <div className="settingTitle">
          <span>Update Account</span>
        </div>
        <form className="settingForm">

          {/* Profile pic */}
          <label>Profile Picture</label>
          <div className="settingFile">
            <label htmlFor="fileInput">
              <i className="settingFileIcon far fa-user-circle"></i>
            </label>

            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                setProfilePic(e.target.files[0]);
              }}
            />

            {profilePic && (
              <img
                className="settingInputDisplay"
                src={URL.createObjectURL(profilePic)}
                alt=""
              />
            )}
          </div>

          {/* Resume */}
          <label>Resume</label>
          <div className="settingFile">
            <label htmlFor="resumeInput">
              <i className="settingFileIcon far fa-light fa-file"></i>
            </label>

            <input
              id="resumeInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                setResume(e.target.files[0]);
              }}
            />

            {/* if file has been staged, display */}
            {resume && (
              <>
                <p className="settingInputDisplay">{resume.name}</p>
              </>
            )}
          </div>

          {/* Name */}
          <label>Name</label>
          <input
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            defaultValue={username}
          />

          <label>Email</label>
          <input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            defaultValue={email}
          />

          <label>Linkedin</label>
          <input
            type="text"
            onChange={(e) => {
              setLinkedin(e.target.value);
            }}
            defaultValue={linkedin}
          />

          <label>Github</label>
          <input
            type="text"
            onChange={(e) => {
              setGithub(e.target.value);
            }}
            defaultValue={github}
          />

          <label>Address</label>
          <input
            type="text"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            defaultValue={address}
          />

          <label>City</label>
          <input
            type="text"
            onChange={(e) => {
              setCity(e.target.value);
            }}
            defaultValue={city}
          />

          <label>Phone</label>
          <input
            type="text"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            defaultValue={phone}
          />

          <label>About</label>
          <textarea
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            placeholder="Hello, my name is.."
            defaultValue={about}
          />

          <label>Title</label>
          <textarea
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="SOFTWARE DEVELOPMENT, MACHINE LEARNING, MSCS@NORTHEASTERN"
            defaultValue={title}
          />
          <button className="settingSubmitButton" onClick={handleSubmit}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Setting;
