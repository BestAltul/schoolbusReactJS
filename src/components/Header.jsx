import React from "react";
import "./header.css";
const Header = () => {
  return (
    <div className="header">
      <h1>General information</h1>
      <p>Data: {new Date().toLocaleDateString()}</p>
    </div>
  );
};
export default Header;
