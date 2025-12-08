import React, { useState, useEffect } from "react";
import { db, auth } from "../../../auth/firebase.init";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import './Product.css';

const Product = () => {
  const user = auth.currentUser;
  const currentUserId = user ? user.uid : null;

  const [sellerProducts, setSellerProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");

  const [sellerInfo, setSellerInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      const productCol = collection(db, "products");
      const productSnapshot = await getDocs(productCol);
      setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  // Fetch current user's seller products
  useEffect(() => {
    if (!currentUserId) return;
    const fetchSellerProducts = async () => {
      const sellerCol = collection(db, "sellerProducts");
      const q = query(sellerCol, where("userId", "==", currentUserId));
      const sellerSnapshot = await getDocs(q);
      setSellerProducts(sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSellerProducts();
  }, [currentUserId]);

  // Fetch seller info and user info
  useEffect(() => {
    if (!currentUserId) return;

    const fetchSellerInfo = async () => {
      const sellerDocRef = doc(db, "sellers", currentUserId);
      const sellerSnapshot = await getDoc(sellerDocRef);
      if (sellerSnapshot.exists()) setSellerInfo(sellerSnapshot.data());
    };

    const fetchUserInfo = async () => {
      const userDocRef = doc(db, "users", currentUserId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) setUserInfo(userSnapshot.data());
    };

    fetchSellerInfo();
    fetchUserInfo();
  }, [currentUserId]);

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setSellingPrice(""); // Clear price for new product
    setShowPricePopup(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice || ""); // Pre-fill price for editing
    setShowPricePopup(true);
  };

  const handlePriceAdd = async () => {
    if (!sellingPrice || !currentUserId || !sellerInfo || !userInfo) {
      alert("Missing information");
      return;
    }

    const price = parseFloat(sellingPrice);

    // Validate price range
    if (selectedProduct.lowestRange && selectedProduct.highestRange) {
      if (price < selectedProduct.lowestRange || price > selectedProduct.highestRange) {
        alert(`Selling price must be between ${selectedProduct.lowestRange} and ${selectedProduct.highestRange}`);
        return;
      }
    }

    const sellerCol = collection(db, "sellerProducts");

    if (selectedProduct.id && selectedProduct.userId === currentUserId) {
      // Editing existing product
      const productDocRef = doc(db, "sellerProducts", selectedProduct.id);
      await updateDoc(productDocRef, {
        sellingPrice: price,
        lastUpdate: serverTimestamp()
      });
    } else {
      // Adding new product
      await addDoc(sellerCol, {
        userId: currentUserId,
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        unit: selectedProduct.unit,
        sellingPrice: price,
        shopName: sellerInfo.shopName,
        shopAddress: sellerInfo.shopAddress,
        division: userInfo.location?.division || "",
        district: userInfo.location?.district || "",
        thana: userInfo.location?.thana || "",
        area: userInfo.location?.area || "",
        lastUpdate: serverTimestamp()
      });
    }

    // Refresh seller products
    const q = query(sellerCol, where("userId", "==", currentUserId));
    const sellerSnapshot = await getDocs(q);
    setSellerProducts(sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    setShowPricePopup(false);
    setShowAddPopup(false);
    setSelectedProduct(null);
    setSellingPrice("");
  };

  const handleDeleteClick = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const productDocRef = doc(db, "sellerProducts", productId);
    await deleteDoc(productDocRef);

    setSellerProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <div className="seller-content">
      <h3 className="seller-title">Seller Product List</h3>

      <div className="seller-table-header">
        <button className="seller-add-btn" onClick={() => setShowAddPopup(true)}>Add Product</button>
      </div>

      <table className="seller-table seller-professional-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Selling Price</th>
            <th>Unit</th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sellerProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.productName}</td>
              <td>{product.sellingPrice}</td>
              <td>{product.unit}</td>
              <td>{product.lastUpdate?.toDate?.()?.toLocaleString()}</td>
              <td>
                <button className="seller-view-btn" onClick={() => handleEditClick(product)}>Edit</button>
                <button className="seller-delete-btn" onClick={() => handleDeleteClick(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Product Popup */}
      {showAddPopup && (
        <div className="seller-popup">
          <div className="seller-popup-content">
            <h4>Select a Product to Add</h4>
            <table className="seller-product-table seller-professional-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Highest Range</th>
                  <th>Lowest Range</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>{product.highestRange}</td>
                    <td>{product.lowestRange}</td>
                    <td>{product.unit}</td>
                    <td>
                      <button className="seller-popup-add-btn" onClick={() => handleAddClick(product)}>Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="seller-cancel-btn" onClick={() => setShowAddPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Selling Price Popup */}
      {showPricePopup && selectedProduct && (
        <div className="seller-popup">
          <div className="seller-popup-content">
            <h4>{selectedProduct.userId ? `Update Selling Price for ${selectedProduct.productName}` : `Set Selling Price for ${selectedProduct.productName}`}</h4>
            <input
              type="number"
              placeholder={`Selling Price (${selectedProduct.lowestRange || 0}-${selectedProduct.highestRange || 0})`}
              className="seller-popup-input"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            <div className="seller-popup-buttons">
              <button className="seller-popup-add-btn" onClick={handlePriceAdd}>Save</button>
              <button className="seller-cancel-btn" onClick={() => setShowPricePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
