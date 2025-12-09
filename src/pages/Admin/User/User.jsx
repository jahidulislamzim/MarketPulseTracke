import React, { useState, useEffect } from "react";
import "./User.css";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../auth/firebase.init";

const User = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [status, setStatus] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));


        const sellerSnapshot = await getDocs(collection(db, "sellers"));
        const sellerData = sellerSnapshot.docs.map(doc => ({
          sid: doc.id,
          ...doc.data(),
        }));


        const mergedList = sellerData
          .map(seller => {
            const userMatch = users.find(u => u.uid === seller.uid);
            return userMatch
              ? { ...userMatch, ...seller } 
              : null;
          })
          .filter(merged => merged !== null);

        setSellers(mergedList);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleView = (id) => {
    const seller = sellers.find(s => s.id === id);
    if (!seller) return;

    setSelectedSeller(seller);
    setStatus(seller.status ?? true);
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedSeller(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedSeller) return;

    try {
      const userRef = doc(db, "users", selectedSeller.id);
      await updateDoc(userRef, { status });

      setSellers(prev =>
        prev.map(s => (s.id === selectedSeller.id ? { ...s, status } : s))
      );

      handleClose();
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Error updating status.");
    }
  };

  if (loading) {
    return <div className="userDetails-content">Loading sellers...</div>;
  }

  return (
    <div className="userDetails-content">
      <h3 className="userDetails-title">Seller List</h3>

      <table className="userDetails-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shop Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sellers.map((seller) => (
            <tr key={seller.id}>
              <td>{seller.name}</td>
              <td>{seller.shopName}</td>
              <td className={`userDetails-status ${seller.status ? "verified" : "not-verified"}`}>
                {seller.status ? "Verified" : "Not Verified"}
              </td>
              <td>
                <button
                  className="userDetails-view-btn"
                  onClick={() => handleView(seller.id)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && selectedSeller && (
        <div className="userDetails-popup">
          <div className="userDetails-popup-content">
            <h4>Seller Details</h4>

            <p><strong>Name:</strong> {selectedSeller.name}</p>
            <p><strong>Shop:</strong> {selectedSeller.shopName}</p>
            <p><strong>Address:</strong> {selectedSeller.shopAddress}</p>

            <label>Status</label>
            <select
              value={status ? "true" : "false"}
              onChange={(e) => setStatus(e.target.value === "true")}
              className="userDetails-popup-input"
            >
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>

            <div className="userDetails-popup-buttons">
              <button className="userDetails-popup-add-btn" onClick={handleUpdateStatus}>
                Update
              </button>
              <button className="userDetails-cancel-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
