import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [role, setRole] = useState("admin"); // role is now dynamic
  const auth = false;

  const handleLogout = () => {
    console.log("Logged out");
  };

  const renderLinks = () => {
    switch (role) {
      case "buyer":
        return (
          <>
            <Link to="/buyer/profile">Profile</Link>
            <Link to="/buyer/report">Reports</Link>
            <Link to="/buyer/my-list">My List</Link>
          </>
        );

      case "seller":
        return (
          <>
            <Link to="/seller/profile">Profile</Link>
            <Link to="/seller/product">Product</Link>
          </>
        );

      case "admin":
        return (
          <>
            <Link to="/admin/profile">Profile</Link>
            <Link to="/admin/product">Products</Link>
            <Link to="/admin/user">Users</Link>
            <Link to="/admin/report">Reports</Link>
          </>
        );

      default:
        return <Link to="/login">Login</Link>;
    }
  };

  return (
    <div className="navbar">
      <h2>MPT</h2>

      <div className="right-nav">
        {/* NEW: Role Dropdown */}
        <div className="role-dropdown">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="nav-links">{renderLinks()}</div>

        <div className="auth-btn">
          {auth ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
