import React from "react";
import './Header.css'

const Header = () => {
  return (
    <div className="navbar">
      <h2>Cart</h2>
      <div className="nav-links">
        <a href="profile.html">Profile</a>
        <a href="products.html">Products</a>
        <a href="reports.html">Reports</a>
        <a href="cart.html" className="active">
          Cart
        </a>
      </div>
    </div>
  );
};

export default Header;
