import React from "react";
import "./Error.css";

const Error = ({ type }) => {
  let message, description;
  switch (type) {
    case 401:
      message = "Unauthorized Access";
      description =
        "Sorry, you are not authorized to access this page. Please sign in.";
      break;
    case 403:
      message = "Access Denied";
      description =
        "We're sorry, but you do not have permission to access this page.";
      break;
    case 404:
      message = "Page Not Found";
      description = "The page you are looking for does not exist.";
      break;
    default:
      message = "Error";
      description = "An unexpected error occurred. Please try again later.";
  }

  return (
    <div className="error-wrapper">
      <div className="error-content">
        <h1 className="not-found-404">{type}</h1>
        <h1 className="not-found-desc1">{message}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Error;
