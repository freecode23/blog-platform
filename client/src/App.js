import "./App.css";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Setting from "./pages/setting/Setting";
import Login from "./pages/login/Login";
import Layout from "./components/layout/Layout";
import { axiosInstance } from "./config";

import { useUserDataContext } from "./context/UserContext";
import { passiveSupport } from 'passive-events-support/src/utils'
passiveSupport({
  debug: true,
  listeners: [
    {
      element: 'div#root',
      event: 'touchend'
    }
  ]
})
require("dotenv").config();
function App() {
  // set empty array as items for Froala Images
  const froalaImages = []
  localStorage.setItem("froalaImages", JSON.stringify(froalaImages))

  // 1. user from auth
  const { user, isLoading, logout } = useAuth0();
  const { setUserData } = useUserDataContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const sub = process.env.REACT_APP_SUB;

  // 2. useEffect for fetch Profile data and handle logout error
  useEffect(() => {
    const fetchProfileData = async () => {
      const fetchedProfileData = await axiosInstance.get("/api/" + sub);
      if (fetchedProfileData.data) {
        setUserData(fetchedProfileData.data);
      }
    };
    fetchProfileData();

    // - logout if theres unauthorized login
    const fetchErrorUrl = async () => {
      const ans = searchParams.get("error");
      if (ans === "unauthorized") {
        localStorage.setItem("snackbar", true);
        logout({ returnTo: window.location.origin });
      }
    };


    fetchErrorUrl();
  }, []);

  function scrollToHomeHandler() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  return (
    <Layout scrollHomeHandler={scrollToHomeHandler}>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            user ? (
              <div>
                <Home />
              </div>
            ) : (
              <Login />
            )
          }
        />

        {/* Home */}
        <Route
          path="/"
          element={
            <div>
              <Home />
            </div>
          }
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
