import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

import { doc, setDoc } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import { db } from "../../auth/firebase.init";
import locationData from "../../data/data.json"; // <-- LOCATION JSON IMPORT

const Registration = () => {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOCATION STATES
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");

  // ROLE BASED DATA
  const [sellerData, setSellerData] = useState({
    tin: "",
    shopName: "",
    shopAddress: "",
  });

  const [customerData, setCustomerData] = useState({
    mobile: "",
    address: "",
  });

  const [adminData, setAdminData] = useState({
    employeeId: "",
    secretCode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);
  const handleRoleChange = (e) => setRole(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasEmptyField =
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !role ||
      !division ||
      !district ||
      !thana ||
      !area;

    if (role === "seller") {
      if (
        !sellerData.tin.trim() ||
        !sellerData.shopName.trim() ||
        !sellerData.shopAddress.trim()
      )
        hasEmptyField = true;
    } else if (role === "customer") {
      if (!customerData.mobile.trim() || !customerData.address.trim())
        hasEmptyField = true;
    } else if (role === "admin") {
      if (!adminData.employeeId.trim() || !adminData.secretCode.trim())
        hasEmptyField = true;
    }

    if (hasEmptyField) {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {
      const userCredential = await registerUser(email, password);
      const uid = userCredential.uid;

      const commonData = {
        uid,
        name,
        email,
        role,
        isVerified: false,
        location: {
          division,
          district,
          thana,
          area,
        },
      };

      await setDoc(doc(db, "users", uid), commonData);

      let roleData = {};
      if (role === "seller") roleData = sellerData;
      if (role === "customer") roleData = customerData;
      if (role === "admin") roleData = adminData;

      await setDoc(doc(db, role + "s", uid), { uid, ...roleData });

      alert("Account created successfully!");
      navigate("/");

      // RESET FIELDS
      setName("");
      setEmail("");
      setPassword("");
      setRole("");

      setDivision("");
      setDistrict("");
      setThana("");
      setArea("");

      setSellerData({ tin: "", shopName: "", shopAddress: "" });
      setCustomerData({ mobile: "", address: "" });
      setAdminData({ employeeId: "", secretCode: "" });

      setErrorMessage("");
    } catch (error) {
      console.error("Error creating account:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Create Your Account</h2>

      <form className="form-box" onSubmit={handleSubmit}>
        <label>Your Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Your Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="show-btn" onClick={togglePassword}>
            👁
          </button>
        </div>

        {/* -------------------- LOCATION DROPDOWNS -------------------- */}

        <label>Select Division</label>
        <select
          value={division}
          onChange={(e) => {
            setDivision(e.target.value);
            setDistrict("");
            setThana("");
            setArea("");
          }}
        >
          <option value="">Select Division</option>
          {Object.keys(locationData).map((div) => (
            <option key={div} value={div}>
              {div}
            </option>
          ))}
        </select>

        <label>Select District</label>
        <select
          value={district}
          disabled={!division}
          onChange={(e) => {
            setDistrict(e.target.value);
            setThana("");
            setArea("");
          }}
        >
          <option value="">Select District</option>
          {division &&
            Object.keys(locationData[division]).map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
        </select>

        <label>Select Thana</label>
        <select
          value={thana}
          disabled={!district}
          onChange={(e) => {
            setThana(e.target.value);
            setArea("");
          }}
        >
          <option value="">Select Thana</option>
          {division &&
            district &&
            Object.keys(locationData[division][district]).map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
        </select>

        <label>Select Area</label>
        <select
          value={area}
          disabled={!thana}
          onChange={(e) => setArea(e.target.value)}
        >
          <option value="">Select Area</option>
          {division &&
            district &&
            thana &&
            locationData[division][district][thana].map((ar) => (
              <option key={ar} value={ar}>
                {ar}
              </option>
            ))}
        </select>

        {/* -------------------- END LOCATION DROPDOWNS -------------------- */}

        <label>Select Role</label>
        <select value={role} onChange={handleRoleChange}>
          <option value="" disabled>
            Select role
          </option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        {role === "seller" && (
          <div className="dynamic-fields">
            <label>TIN ID</label>
            <input
              type="text"
              placeholder="Enter TIN ID"
              value={sellerData.tin}
              onChange={(e) =>
                setSellerData({ ...sellerData, tin: e.target.value })
              }
            />

            <label>Shop Name</label>
            <input
              type="text"
              placeholder="Enter shop name"
              value={sellerData.shopName}
              onChange={(e) =>
                setSellerData({ ...sellerData, shopName: e.target.value })
              }
            />

            <label>Shop Address</label>
            <input
              type="text"
              placeholder="Enter shop address"
              value={sellerData.shopAddress}
              onChange={(e) =>
                setSellerData({ ...sellerData, shopAddress: e.target.value })
              }
            />
          </div>
        )}

        {role === "customer" && (
          <div className="dynamic-fields">
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={customerData.mobile}
              onChange={(e) =>
                setCustomerData({ ...customerData, mobile: e.target.value })
              }
            />

            <label>Customer Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={customerData.address}
              onChange={(e) =>
                setCustomerData({ ...customerData, address: e.target.value })
              }
            />
          </div>
        )}

        {role === "admin" && (
          <div className="dynamic-fields">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="Enter employee ID"
              value={adminData.employeeId}
              onChange={(e) =>
                setAdminData({ ...adminData, employeeId: e.target.value })
              }
            />

            <label>Admin Secret Code</label>
            <input
              type="password"
              placeholder="Enter secret code"
              value={adminData.secretCode}
              onChange={(e) =>
                setAdminData({ ...adminData, secretCode: e.target.value })
              }
            />
          </div>
        )}

        <button type="submit" className="next-btn">
          Create Account
        </button>

        {errorMessage && <span className="error">{errorMessage}</span>}

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Registration;
