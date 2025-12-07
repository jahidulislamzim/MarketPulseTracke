import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <h2 className="title">Market Pulse Tracker</h2>

      <div className="login-box">
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          className="input-field"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="input-field"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        <button className="login-btn">Log In</button>

        <div className="signup-text">
          Don’t have an account? <Link className="signup-link" to="/registration">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

