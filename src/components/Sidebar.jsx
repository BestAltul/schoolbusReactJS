import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? "Hide" : "Show"}
      </button>

      <nav className="sidebar-links">
        <ul>
          <li>
            <Link to="/buses">Buses</Link>
          </li>
          <li>
            <Link to="/cameras">Cameras</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
