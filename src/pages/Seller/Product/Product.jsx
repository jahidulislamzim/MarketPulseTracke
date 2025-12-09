import React, { useState, useEffect } from "react";
import { db, auth } from "../../../auth/firebase.init";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import './Product.css';

const Product = () => {
  const user = auth.currentUser;
  const currentUserId = user ? user.uid : null;

  const [sellerProducts, setSellerProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [mergedProducts, setMergedProducts] = useState([]);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");

  
  useEffect(() => {
    const fetchProducts = async () => {
      const productCol = collection(db, "products");
      const productSnapshot = await getDocs(productCol);
      setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchSellerProducts = async () => {
      const sellerCol = collection(db, "sellerProducts");
      const q = query(sellerCol, where("sellerId", "==", currentUserId));
      const sellerSnapshot = await getDocs(q);
      setSellerProducts(sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchSellerProducts();
  }, [currentUserId]);


  useEffect(() => {
    if (products.length === 0 || sellerProducts.length === 0) return;

    const merged = sellerProducts.map(sellerProduct => {
      const productDetails = products.find(p => p.id === sellerProduct.productId);
      return {
        ...productDetails,        
        ...sellerProduct,         
        sellerProductId: sellerProduct.id
      };
    });

    setMergedProducts(merged);
  }, [products, sellerProducts]);

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setSellingPrice(""); 
    setShowPricePopup(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setSellingPrice(product.sellingPrice || "");
    setShowPricePopup(true);
  };

  const handlePriceSave = async () => {
    if (!selectedProduct) return;

    const price = parseFloat(sellingPrice);
    if (selectedProduct.lowestRange != null && selectedProduct.highestRange != null) {
      if (price < selectedProduct.lowestRange || price > selectedProduct.highestRange) {
        alert(`Selling price must be between ${selectedProduct.lowestRange} and ${selectedProduct.highestRange}`);
        return;
      }
    }

    if (selectedProduct.sellerProductId) {

      const productDocRef = doc(db, "sellerProducts", selectedProduct.sellerProductId);
      await updateDoc(productDocRef, {
        sellingPrice: price,
        lastUpdate: serverTimestamp()
      });
    } else {

      await addDoc(collection(db, "sellerProducts"), {
        sellerId: currentUserId,
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        unit: selectedProduct.unit,
        sellingPrice: price,
        lastUpdate: serverTimestamp()
      });
    }


    const sellerCol = collection(db, "sellerProducts");
    const q = query(sellerCol, where("sellerId", "==", currentUserId));
    const sellerSnapshot = await getDocs(q);
    setSellerProducts(sellerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    setShowPricePopup(false);
    setSelectedProduct(null);
    setSellingPrice("");
    setShowAddPopup(false);
  };

  const handleDeleteClick = async (sellerProductId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const productDocRef = doc(db, "sellerProducts", sellerProductId);
    await deleteDoc(productDocRef);
    setSellerProducts(prev => prev.filter(p => p.id !== sellerProductId));
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
            <th>Price Range</th>
            <th>Selling Price</th>
            <th>Unit</th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mergedProducts.map(product => (
            <tr key={product.sellerProductId}>
              <td>{product.productName}</td>
              <td>{product.lowestRange} - {product.highestRange}</td>
              <td>{product.sellingPrice}</td>
              <td>{product.unit}</td>
              <td>{product.lastUpdate?.toDate?.()?.toLocaleString() || "-"}</td>
              <td>
                <button className="seller-view-btn" onClick={() => handleEditClick(product)}>Edit</button>
                <button className="seller-delete-btn" onClick={() => handleDeleteClick(product.sellerProductId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddPopup && (
        <div className="seller-popup">
          <div className="seller-popup-content">
            <h4>Select a Product to Add</h4>
            <div className="seller-popup-table-container">
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
                  {products.map(product => (
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
            </div>
            <button className="seller-cancel-btn" onClick={() => setShowAddPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showPricePopup && selectedProduct && (
        <div className="seller-popup">
          <div className="seller-popup-content">
            <h4>{selectedProduct.sellerProductId ? `Update Selling Price for ${selectedProduct.productName}` : `Set Selling Price for ${selectedProduct.productName}`}</h4>
            <input
              type="number"
              placeholder={`Selling Price (${selectedProduct.lowestRange} - ${selectedProduct.highestRange})`}
              className="seller-popup-input"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            <div className="seller-popup-buttons">
              <button className="seller-popup-add-btn" onClick={handlePriceSave}>Save</button>
              <button className="seller-cancel-btn" onClick={() => setShowPricePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
