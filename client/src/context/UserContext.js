import React from "react";
import { createContext } from "react";

// - create empty context
const UserDataContext = createContext();

// - create provider (used in index.js to wrap app)
function UserDataProvider({ children }) {
  const [userData, setUserData] = React.useState();

  const value = { userData, setUserData };
  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

// - create context containing userData and setUserData (used in children)
function useUserDataContext() {
  const context = React.useContext(UserDataContext);

  if (context === undefined) {
    throw new Error("useUserData must be within a UserDatProvider");
  }
  // userData and setUserData
  return context;
}

export { UserDataProvider, useUserDataContext };
