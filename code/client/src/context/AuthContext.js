import React, { createContext, useState, useEffect } from "react";
import { getCookie } from "../utils/cookieUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    !!getCookie("sessionToken")
  );

  useEffect(() => {
    const handleCookieChange = () => {
      setAuthenticated(!!getCookie("sessionToken"));
    };

    window.addEventListener("storage", handleCookieChange);

    return () => {
      window.removeEventListener("storage", handleCookieChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
