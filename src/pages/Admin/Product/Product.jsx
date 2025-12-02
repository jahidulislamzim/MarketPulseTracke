import React, { useState } from "react";
import "./Product.css";

const Report = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    highestRange: "",
    lowestRange: "",
    unit: "",
  });

  const openPopup = () => {
    setShowPopup(true);
    setError("");
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData({
      productName: "",
      highestRange: "",
      lowestRange: "",
      unit: "",
    });
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const { productName, highestRange, lowestRange, unit } = formData;

    if (!productName || !highestRange || !lowestRange || !unit) {
      setError("All fields are required!");
      return;
    }

    const low = Number(lowestRange);
    const high = Number(highestRange);

    if (low > high) {
      setError("Lowest price cannot be greater than highest price!");
      return;
    }

    if (high < low) {
      setError("Highest price cannot be less than lowest price!");
      return;
    }

    console.log("Product Added:", formData);
    closePopup();
  };

  const products = [
    {
      name: "Monthly Sales Report",
      price: "ABC Store",
      lastUpdate: "2025-12-01 14:00",
      status: "Resolved",
    },
  ];

  return (
    <div className="content">
      <h3>Product List</h3>
      <button className="add-btn" onClick={openPopup}>
        Add Product
      </button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Base Price</th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.lastUpdate}</td>
              <td>
                <button className="view-btn same-btn">View</button>
                <button className="delete-btn same-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Add New Product</h3>

            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter Product Name"
              value={formData.productName}
              onChange={handleChange}
            />

            <label>Highest Price</label>
            <input
              type="number"
              name="highestRange"
              placeholder="Enter Highest Price"
              value={formData.highestRange}
              onChange={handleChange}
            />

            <label>Lowest Price</label>
            <input
              type="number"
              name="lowestRange"
              placeholder="Enter Lowest Price"
              value={formData.lowestRange}
              onChange={handleChange}
            />

            <label>Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="">Select Unit</option>
              <option value="kg">KG</option>
              <option value="litre">Litre</option>
              <option value="piece">Piece</option>
            </select>

            <div className="popup-actions">
              <button className="cancel-btn same-btn" onClick={closePopup}>
                Cancel
              </button>
              <button className="add-btn same-btn" onClick={handleAdd}>
                Add
              </button>
            </div>

            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
