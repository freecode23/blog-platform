import React from "react";
import { createContext } from "react";

// - create empty context
const UpdateModeContext = createContext();

// - create provider (used in index.js to wrap app)
function UpdateModeProvider({ children }) {
    const [updateMode, setUpdateMode] = React.useState(false);

    const value = { updateMode, setUpdateMode };
    return (
        <UpdateModeContext.Provider value={value}>
            {children}
        </UpdateModeContext.Provider>
    );
}

// - create context containing updateMode and setUpdateMode (used in children)
function useUpdateModeContext() {
    const context = React.useContext(UpdateModeContext);

    if (context === undefined) {
        throw new Error("useUpdateMode must be within a UserDatProvider");
    }
    // updateMode and setUpdateMode
    return context;
}

export { UpdateModeProvider, useUpdateModeContext };
