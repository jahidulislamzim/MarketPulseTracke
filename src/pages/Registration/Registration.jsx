import React, { useState } from "react";
import "./Registration.css"

const Registration = () => {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
  };
  return (
    <div className="container">
      <h2 className="heading">Create Your Account</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input type="text" placeholder="Enter your name" required />

        <label>Your Email</label>
        <input type="email" placeholder="Enter email" required />

        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            required
          />
          <button type="button" className="show-btn" onClick={togglePassword}>
            👁
          </button>
        </div>

        {/* ROLE SELECTION */}
        <label>Select Role</label>
        <select value={role} onChange={handleRoleChange} required>
          <option value="" disabled>
            Select role
          </option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        {/* DYNAMIC FIELDS */}
        {role === "seller" && (
          <div>
            <label>TIN ID</label>
            <input type="text" placeholder="Enter TIN ID" required />

            <label>Shop Name</label>
            <input type="text" placeholder="Enter shop name" required />

            <label>Shop Address</label>
            <input type="text" placeholder="Enter shop address" required />
          </div>
        )}

        {role === "customer" && (
          <div>
            <label>Mobile Number</label>
            <input type="tel" placeholder="Enter mobile number" required />

            <label>Customer Address</label>
            <input type="text" placeholder="Enter your address" required />
          </div>
        )}

        {role === "admin" && (
          <div>
            <label>Employee ID</label>
            <input type="text" placeholder="Enter employee ID" required />

            <label>Admin Secret Code</label>
            <input type="password" placeholder="Enter secret code" required />
          </div>
        )}

        <button type="submit" className="next-btn">
          Create Account
        </button>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Registration;
