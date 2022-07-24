import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserDataProvider } from "./context/UserContext";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";


require("dotenv").config();

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <UserDataProvider>
        <App />
      </UserDataProvider>
    </Auth0Provider>
  </Router>
);
