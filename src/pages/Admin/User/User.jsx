import React, { useState } from "react";
import './User.css';

const Report = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [status, setStatus] = useState("verified");

  const [sellers, setSellers] = useState([
    { id: 1, name: "Kamal", shopName: "ABC Store", phone: "01712345678", status: "verified" },
    { id: 2, name: "Munna Bhai", shopName: "XYZ Mart", phone: "01887654321", status: "not-verified" },
  ]);

  const handleView = (id) => {
    const seller = sellers.find(s => s.id === id);
    if (!seller) return;

    setSelectedSeller(seller);
    setStatus(seller.status);
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedSeller(null);
  };

  const handleUpdateStatus = () => {
    setSellers(
      sellers.map(s =>
        s.id === selectedSeller.id
          ? { ...s, status: status }
          : s
      )
    );
    handleClose();
  };

  return (
    <div className="content">
      <h3>Seller List</h3>

      <table className="report-table">
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
              <td className={`status ${seller.status}`}>
                {seller.status === "verified" ? "Verified" : "Not Verified"}
              </td>
              <td>
                <button className="view-btn" onClick={() => handleView(seller.id)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && selectedSeller && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Seller Details</h3>

            <p><strong>Name:</strong> {selectedSeller.name}</p>
            <p><strong>Shop:</strong> {selectedSeller.shopName}</p>
            <p><strong>Phone:</strong> {selectedSeller.phone}</p>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="verified">Verified</option>
              <option value="not-verified">Not Verified</option>
            </select>

            <div className="popup-actions">
              <button className="add-btn" onClick={handleUpdateStatus}>Update</button>
              <button className="cancel-btn" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Report;
