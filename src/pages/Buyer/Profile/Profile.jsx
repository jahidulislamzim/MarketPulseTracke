import React, { useState } from 'react';
// import "./Profile.css"

const Profile = () => {
     const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Jahidul Islam",
    email: "jahidulislamzim845@gmail.com",
    phone: "+880 123 456 789",
    address: "Dhaka, Bangladesh",
    memberSince: "Jan 2025",
    status: "Active",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const enableEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const saveChanges = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  return (
    <div className="content">
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
          className="profile-img"
          alt="Profile"
        />

        <div className="profile-details">
          <div className="all-field">
            {Object.entries(tempProfile).map(([key, value]) => (
              <div className="field" key={key}>
                <label>{key.replace(/([A-Z])/g, " $1")}</label>
                {!isEditing ? (
                  <p className="view">{profile[key]}</p>
                ) : (
                  <input
                    className="edit"
                    type="text"
                    name={key}
                    value={tempProfile[key]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="edit-actions-container">
          {!isEditing ? (
            <button className="edit-btn" onClick={enableEdit}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={saveChanges}>
                Save
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
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