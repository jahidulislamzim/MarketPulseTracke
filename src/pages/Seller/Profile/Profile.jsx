import React, { useEffect, useState } from "react";
import "./Profile.css";

import ProfilePic from "../../../assets/profile.webp";
import locationData from "../../../data/data.json";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../auth/firebase.init";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({});
  const [tempProfile, setTempProfile] = useState({});

  // Location dropdown states
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");

  // Fields that can be edited
  const editableFields = ["name", "division", "district", "thana", "area", "shopName", "shopAddress"];

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const sellerRef = doc(db, "sellers", user.uid);

      const userSnap = await getDoc(userRef);
      const sellerSnap = await getDoc(sellerRef);

      const userData = userSnap.exists() ? userSnap.data() : {};
      const sellerData = sellerSnap.exists() ? sellerSnap.data() : {};

      const merged = { ...userData, ...sellerData };

      setProfile(merged);
      setTempProfile(merged);

      // Initialize location dropdowns
      setDivision(merged.division || "");
      setDistrict(merged.district || "");
      setThana(merged.thana || "");
      setArea(merged.area || "");

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const updatedProfile = {
      ...tempProfile,
      division,
      district,
      thana,
      area,
    };

    const userFields = {};
    const sellerFields = {};

    Object.entries(updatedProfile).forEach(([key, val]) => {
      if (["tin", "shopName", "shopAddress"].includes(key)) {
        sellerFields[key] = val;
      } else {
        userFields[key] = val;
      }
    });

    await updateDoc(doc(db, "users", user.uid), userFields);
    await updateDoc(doc(db, "sellers", user.uid), sellerFields);

    setProfile(updatedProfile);
    setTempProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;

  // Field order
  const fieldOrder = [
    "name",
    "email",
    "role",
    "division",
    "district",
    "thana",
    "area",
    "shopName",
    "shopAddress",
    "tin",
    "isVerified",
  ];

  return (
    <div className="content">
      <div className="profile-card">
        <img src={ProfilePic} className="profile-img" alt="Profile" />

        <div className="profile-details">
          <div className="all-field">
            {fieldOrder.map((key) => {
              if (!profile.hasOwnProperty(key)) return null;

              const label = key.replace(/([A-Z])/g, " $1");

              // If editing, only show editable fields
              if (isEditing && !editableFields.includes(key)) return null;

              // Location dropdowns
              if (["division", "district", "thana", "area"].includes(key)) {
                if (isEditing) {
                  return (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      {key === "division" && (
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
                      )}
                      {key === "district" && (
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
                      )}
                      {key === "thana" && (
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
                      )}
                      {key === "area" && (
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
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      <p className="view">{profile[key]}</p>
                    </div>
                  );
                }
              }

              // Normal fields
              return (
                <div className="field" key={key}>
                  <label>{label}</label>
                  {isEditing ? (
                    <input
                      className="edit"
                      type="text"
                      name={key}
                      value={tempProfile[key]}
                      onChange={handleChange}
                    />
                  ) : key === "isVerified" ? (
                    <p className="view">{profile[key] ? "Verified" : "Not Verified"}</p>
                  ) : (
                    <p className="view">{profile[key]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="edit-actions-container">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={saveChanges}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setTempProfile(profile);
                  setDivision(profile.division || "");
                  setDistrict(profile.district || "");
                  setThana(profile.thana || "");
                  setArea(profile.area || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
