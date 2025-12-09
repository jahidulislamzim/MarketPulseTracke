import React, { useState, useEffect } from "react";
import "./Product.css";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../auth/firebase.init";

const Product = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    highestRange: "",
    lowestRange: "",
    unit: "",
  });

  const [products, setProducts] = useState([]);
  const productsCollection = collection(db, "products");

  // Fetch products safely
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(productsCollection);
      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleAddClick = () => {
    setShowPopup(true);
    setError("");
    setEditingId(null);
    setFormData({
      productName: "",
      highestRange: "",
      lowestRange: "",
      unit: "",
    });
  };

  const formatDateBD = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    });
  };

  const handleAddProduct = async () => {
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

    try {
      const newDocRef = doc(productsCollection); 

      const newProduct = {
        uid: newDocRef.id, 
        productName,
        highestRange: high,
        lowestRange: low,
        unit,
        lastUpdate: new Date().toISOString(),
      };

      await setDoc(newDocRef, newProduct);
      await fetchProductsList();
      handleCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to add product.");
    }
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

  const handleUpdateProduct = async () => {
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

    const productRef = doc(db, "products", editingId);

    try {
      await updateDoc(productRef, {
        productName,
        highestRange: high,
        lowestRange: low,
        unit,
        lastUpdate: new Date().toISOString(),
      });
      await fetchProductsList();
      handleCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to update product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const productRef = doc(db, "products", id);
    try {
      await deleteDoc(productRef);
      await fetchProductsList();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setEditingId(null);
    setError("");
    setFormData({
      productName: "",
      highestRange: "",
      lowestRange: "",
      unit: "",
    });
  };

  return (
    <div className="admin-product-content">
      <h3 className="admin-product-title">Product List</h3>
      <button className="admin-product-add-btn" onClick={handleAddClick}>
        Add Product
      </button>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="admin-product-table">
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
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.productName}</td>
                  <td>{product.lowestRange}</td>
                  <td>{product.highestRange}</td>
                  <td>{product.unit}</td>
                  <td>{formatDateBD(product.lastUpdate)}</td>
                  <td>
                    <button
                      className="admin-product-view-btn"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-product-delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showPopup && (
        <div className="admin-product-popup">
          <div className="admin-product-popup-content">
            <h4>{editingId ? "Edit Product" : "Add New Product"}</h4>

            <input
              type="text"
              placeholder="Product Name"
              className="admin-product-popup-input"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Highest Price"
              className="admin-product-popup-input"
              value={formData.highestRange}
              onChange={(e) =>
                setFormData({ ...formData, highestRange: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Lowest Price"
              className="admin-product-popup-input"
              value={formData.lowestRange}
              onChange={(e) =>
                setFormData({ ...formData, lowestRange: e.target.value })
              }
            />

            <select
              className="admin-product-popup-input"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            >
              <option value="">Select Unit</option>
              <option value="kg">KG</option>
              <option value="litre">Litre</option>
              <option value="piece">Piece</option>
            </select>

            <div className="admin-product-popup-buttons">
              <button
                className="admin-product-popup-add-btn"
                onClick={editingId ? handleUpdateProduct : handleAddProduct}
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button className="admin-product-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {error && <p className="admin-product-error-msg">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
