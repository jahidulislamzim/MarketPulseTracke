import React, { useState, useEffect } from "react";
import "./Product.css";
import { db } from "../../../auth/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const Product = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    highestRange: "",
    lowestRange: "",
    unit: "",
  });

  const [products, setProducts] = useState([]);

  const productsCollection = collection(db, "products");

  const fetchProductsList = async () => {
    try {
      const snapshot = await getDocs(productsCollection);
      const productsList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setProducts(productsList);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductsList();
    };

    fetchData();
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

    const newProduct = {
      productName,
      highestRange: high,
      lowestRange: low,
      unit,
      lastUpdate: new Date().toISOString(),
    };

    try {
      await addDoc(productsCollection, newProduct);
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
        lastUpdate: new Date().toISOString(), // ISO 8601
      });
      await fetchProductsList();
      handleCancel();
    } catch (err) {
      console.error(err);
      setError("Failed to update product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

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
              <td>{formatDateBD(product.lastUpdate)}</td>
              <td>
                <button
                  className="view-btn same-btn"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn same-btn"
                  onClick={() => handleDelete(product.id)}
                >
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
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
            />

            <label>Highest Price</label>
            <input
              type="number"
              value={formData.highestRange}
              onChange={(e) =>
                setFormData({ ...formData, highestRange: e.target.value })
              }
            />

            <label>Lowest Price</label>
            <input
              type="number"
              value={formData.lowestRange}
              onChange={(e) =>
                setFormData({ ...formData, lowestRange: e.target.value })
              }
            />

            <label>Unit</label>
            <select
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

            <div className="popup-actions">
              <button className="cancel-btn same-btn" onClick={handleCancel}>
                Cancel
              </button>
              {editingId ? (
                <button
                  className="add-btn same-btn"
                  onClick={handleUpdateProduct}
                >
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

export default Product;
