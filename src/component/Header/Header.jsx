import React from "react";
import './Header.css'
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="navbar">
      <h2></h2>
      <div className="nav-links">
        <Link to="/buyer/Profile">Profile</Link>
        <Link to="/buyer/report">Repoprts 2</Link>
        <Link to="/buyer/report">Reports</Link>
        <Link to="/buyer/my-list">My List</Link>
      </div>
    </div>
  );
};

export default Header;
