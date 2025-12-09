import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user, logOut} = useAuth();
  console.log(user);

  const handleLogout = () => {
    logOut();
  };

  const renderLinks = () => {
    if (!user)
      return (
        <Link to="/login" className="auth-btn-link">
          Login
        </Link>
      );

    switch (user?.role) {
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
        return null;
    }
  };

  return (
    <div className="navbar">
      <h2>MPT</h2>

      <div className="right-nav">
        <div className="nav-links">{renderLinks()}</div>

        {user && (
          <div className="auth-btn">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
