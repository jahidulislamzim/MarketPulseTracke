import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";


const Header = () => {
  const role = "buyer"; 
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
            <Link to="/seller/dashboard">Dashboard</Link>
            <Link to="/seller/products">My Products</Link>
            <Link to="/seller/orders">Orders</Link>
          </>
        );

      case "admin":
        return (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/reports">Reports</Link>
          </>
        );

      default:
        return (
          <>
            <Link to="/login">Login</Link>
          </>
        );
    }
  };

  return (
    <div className="navbar">
      <h2>MPT</h2>

      <div className="right-nav">
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
