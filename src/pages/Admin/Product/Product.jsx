import React, { useState } from "react";
import "./Product.css";

const Report = () => {
  const [showPopup, setShowPopup] = useState(false); 
  const [error, setError] = useState("");         
  const [editingId, setEditingId] = useState(null); 

  const [formData, setFormData] = useState({
    productName: "",
    highestRange: "",
    lowestRange: "",
    unit: "",
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: "Product 1",
      highestRange: 1000,
      lowestRange: 500,
      unit: "piece",
      lastUpdate: "2025-12-01 14:00",
    },
    {
      id: 2,
      productName: "Bad Product Report",
      highestRange: 2000,
      lowestRange: 1000,
      unit: "kg",
      lastUpdate: "2025-12-02 10:30",
    },
  ]);

  const handleAddClick = () => {
    setShowPopup(true);
    setError("");
    setEditingId(null);
    setFormData({ productName: "", highestRange: "", lowestRange: "", unit: "" });
  };


  const handleAddProduct = () => {
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

    const newProduct = {
      id: new Date().getTime(),
      productName,
      highestRange,
      lowestRange,
      unit,
      lastUpdate: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setProducts([...products, newProduct]);
    handleCancel();
  };


  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    setFormData({
      productName: product.productName,
      highestRange: product.highestRange,
      lowestRange: product.lowestRange,
      unit: product.unit,
    });
    setEditingId(id);
    setShowPopup(true);
    setError("");
  };


  const handleUpdateProduct = () => {
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

    const updatedProduct = {
      id: editingId,
      productName,
      highestRange,
      lowestRange,
      unit,
      lastUpdate: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setProducts(products.map((p) => (p.id === editingId ? updatedProduct : p)));
    handleCancel();
  };


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };


  const handleCancel = () => {
    setShowPopup(false);
    setEditingId(null);
    setError("");
    setFormData({ productName: "", highestRange: "", lowestRange: "", unit: "" });
  };


  return (
    <div className="content">
      <h3>Product List</h3>
      <button className="add-btn same-btn" onClick={handleAddClick}>
        Add Product
      </button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Lowest Price</th>
            <th>Highest Price</th>
            <th>Unit</th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>{product.lowestRange}</td>
              <td>{product.highestRange}</td>
              <td>{product.unit}</td>
              <td>{product.lastUpdate}</td>
              <td>
                <button className="view-btn same-btn" onClick={() => handleEdit(product.id)}>
                  Edit
                </button>
                <button className="delete-btn same-btn" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />

            <label>Highest Price</label>
            <input
              type="number"
              name="highestRange"
              value={formData.highestRange}
              onChange={(e) => setFormData({ ...formData, highestRange: e.target.value })}
            />

            <label>Lowest Price</label>
            <input
              type="number"
              name="lowestRange"
              value={formData.lowestRange}
              onChange={(e) => setFormData({ ...formData, lowestRange: e.target.value })}
            />

            <label>Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="">Select Unit</option>
              <option value="kg">KG</option>
              <option value="litre">Litre</option>
              <option value="piece">Piece</option>
            </select>

            <div className="popup-actions">
              <button className="cancel-btn same-btn" onClick={handleCancel}>
                Cancel
              </button>
              {editingId ? (
                <button className="add-btn same-btn" onClick={handleUpdateProduct}>
                  Update
                </button>
              ) : (
                <button className="add-btn same-btn" onClick={handleAddProduct}>
                  Add
                </button>
              )}
            </div>

            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
