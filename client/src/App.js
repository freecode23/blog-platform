import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from 'react-router-dom';
import Home from "./pages/home/Home";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Setting from "./pages/setting/Setting";
import Login from "./pages/login/Login";
import Layout from "./components/layout/Layout";

import axios from "axios";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUserDataContext } from "./context/UserContext";
import { useUpdateModeContext } from "./context/UpdateModeContext";


require("dotenv").config();
function App() {
  // - user from auth
  const { user, isLoading, logout } = useAuth0();
  const { setUserData } = useUserDataContext();
  const { updateMode, setUpdateMode } = useUpdateModeContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const sub = process.env.REACT_APP_SUB;

  // - get sherly's data from database
  useEffect(() => {
    const fetchProfileData = async () => {
      const fetchedProfileData = await axios.get(sub);
      if (fetchedProfileData.data) {
        setUserData(fetchedProfileData.data);
      }
    };
    fetchProfileData();

    // - logout if theres unauthorized login
    const fetchErrorUrl = async () => {
      const ans = searchParams.get("error");
      if (ans === "unauthorized") {

        localStorage.setItem('snackbar', true)
        logout({ returnTo: window.location.origin });
        // Question: make pop up here
      }
    }
    fetchErrorUrl();
  }, []);


  function scrollToHomeHandler() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }


  return (
    <Layout scrollHomeHandler={scrollToHomeHandler} >
      <Routes>
        {/* Login */}
        <Route path="/login" element={user ?
          <div >
            <Home />
          </div> : <Login />} />

        {/* Home */}
        <Route
          path="/"
          element={
            // Question: weird position when clicked
            <div >
              <Home />
            </div>}
        />

        {/* Write */}
        {user && !isLoading && <Route path="/write" element={<Write />} />}
        {!user && (
          <Route
            path="/write"
            element={isLoading ? <p>Loading...</p> : <Login />}
          />
        )}
        {/* Setting */}
        <Route path="/setting" element={user ? <Setting /> : <Login />} />

        {/* Single */}
        <Route path="/blogposts/:postId" element={<Single />} />
      </Routes>
    </Layout>
  );
}

export default App;
