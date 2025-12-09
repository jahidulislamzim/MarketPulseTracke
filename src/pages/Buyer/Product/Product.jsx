import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../auth/firebase.init"; 
import './Product.css';
import locationData from "../../../data/data.json"; 

const Product = () => {
  const [mergedData, setMergedData] = useState([]);
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const sellerSnapshot = await getDocs(collection(db, "sellerProducts"));
        const sellerProducts = sellerSnapshot.docs.map(doc => doc.data());

        const productsSnapshot = await getDocs(collection(db, "products"));
        const products = productsSnapshot.docs.map(doc => doc.data());

        console.log(products);

        const merged = sellerProducts.map(seller => {
          const productMatch = products.find(p => p.productName === seller.productName);
          return {
            productName: seller.productName,
            shopName: seller.shopName,
            shopAddress: seller.shopAddress,
            sellerPrice: seller.sellingPrice,
            unit: seller.unit,
            priceRange: productMatch
              ? `${productMatch.lowestRange} - ${productMatch.highestRange}`
              : "-",
          };
        });

        setMergedData(merged);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="buyer-product-content">
      <h3>Product List</h3>

      {/* Location Selector */}
      <div className="location-selector">
        <div>
          <label>Select Division</label>
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
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Select District</label>
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
                <option key={dist} value={dist}>{dist}</option>
              ))}
          </select>
        </div>

        <div>
          <label>Select Thana</label>
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
                <option key={th} value={th}>{th}</option>
              ))}
          </select>
        </div>

        <div>
          <label>Select Area</label>
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
                <option key={ar} value={ar}>{ar}</option>
              ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <table className="buyer-product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Shop Name</th>
            <th>Shop Address</th>
            <th>Price Range</th>
            <th>Seller Price</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mergedData.map((item, index) => (
            <tr key={index}>
              <td className="buyer-text">{item.productName}</td>
              <td className="buyer-text">{item.shopName}</td>
              <td className="buyer-text">{item.shopAddress}</td>
              <td className="buyer-text">{item.priceRange}</td>
              <td className="buyer-text">{item.sellerPrice}</td>
              <td className="buyer-text">{item.unit}</td>
              <td>
                <button className="add-cart-btn">Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
