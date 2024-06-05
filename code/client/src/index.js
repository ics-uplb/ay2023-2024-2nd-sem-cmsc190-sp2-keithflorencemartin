import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/UserContext";

const root = createRoot(document.getElementById("root"));

root.render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
);
