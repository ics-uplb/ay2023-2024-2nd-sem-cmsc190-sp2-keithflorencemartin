import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const LeftMenu = ({ mode, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuItemClick = () => {
    if (typeof onClose === "function") {
      onClose(); // Close the drawer if onClose is a function
    }
  };

  const handleNavigate = (path) => {
    handleMenuItemClick();
    navigate(path);
  };

  return (
    <div className="lm-left-menu">
      <ul className={`lm-left-ul ${mode === "horizontal" ? "horizontal" : ""}`}>
        <li>
          <span
            onClick={() => handleNavigate("/")}
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </span>
        </li>
        <li>
          <span
            onClick={() => handleNavigate("/advsearch")}
            className={location.pathname === "/advsearch" ? "active" : ""}
          >
            Isolates
          </span>
        </li>
        <li>
          <span
            onClick={() => handleNavigate("/taxonomic-tree")}
            className={location.pathname === "/taxonomic-tree" ? "active" : ""}
          >
            Taxonomic Tree
          </span>
        </li>
      </ul>
    </div>
  );
};

export default LeftMenu;
