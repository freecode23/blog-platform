import React from "react";
import { createContext } from "react";

// - create empty context
const SnackbarContext = createContext();

// - create provider (used in index.js to wrap app)
function SnackbarProvider({ children }) {
    const [showSnackbar, setShowSnackbar] = React.useState(false);
    function closeSnackbarHandler() {
        localStorage.removeItem('snackbar');
        setShowSnackbar(false);
    }


    const value = { showSnackbar, setShowSnackbar, closeSnackbarHandler };
    return (
        <SnackbarContext.Provider value={value}>
            {children}
        </SnackbarContext.Provider>
    );
}

// - create context containing showSnackbar and setShowSnackbar (used in children)
function useSnackbarContext() {
    const context = React.useContext(SnackbarContext);

    if (context === undefined) {
        throw new Error("useSnackbar must be within a SnackbarProvider");
    }
    // showSnackbar and setShowSnackbar
    return context;
}

export { SnackbarProvider, useSnackbarContext };
