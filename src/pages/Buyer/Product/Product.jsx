import React, { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db, auth } from "../../../auth/firebase.init";
import "./Product.css";
import locationData from "../../../data/data.json";

const Product = () => {
  const [mergedData, setMergedData] = useState([]);

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [thana, setThana] = useState("");
  const [area, setArea] = useState("");

  // ---------------------- FETCH & MERGE DATA ----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sellerProductsSnapshot,
          productsSnapshot,
          usersSnapshot,
          sellersSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, "sellerProducts")),
          getDocs(collection(db, "products")),
          getDocs(collection(db, "users")),
          getDocs(collection(db, "sellers")),
        ]);

        const sellerProducts = sellerProductsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const products = productsSnapshot.docs.map((doc) => ({
          pid: doc.id,
          ...doc.data(),
        }));

        const users = usersSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        const sellers = sellersSnapshot.docs.map((doc) => ({
          sid: doc.id,
          ...doc.data(),
        }));

        const merged = sellerProducts.map((sp) => {
          const product = products.find((p) => p.pid === sp.productId);
          const user = users.find((u) => u.uid === sp.sellerId);
          const seller = sellers.find((s) => s.sid === sp.sellerId);

          return {
            sellerProductId: sp.id,
            productId: sp.productId,
            sellerId: sp.sellerId,
            sellingPrice: sp.sellingPrice,
            unit_sp: sp.unit,
            lastUpdate_sp: sp.lastUpdate,

            productName: product?.productName ?? "-",
            lowestRange: product?.lowestRange ?? null,
            highestRange: product?.highestRange ?? null,
            unit: product?.unit ?? "-",

            shopName: seller?.shopName ?? "-",
            shopAddress: seller?.shopAddress ?? "-",

            sellerName: user?.name ?? "-",
            email: user?.email ?? "-",

            location: {
              division: user?.location?.division ?? "",
              district: user?.location?.district ?? "",
              thana: user?.location?.thana ?? "",
              area: user?.location?.area ?? "",
            },
          };
        });

        setMergedData(merged);
      } catch (error) {
        console.error("Error merging data:", error);
      }
    };

    fetchData();
  }, []);

  // ---------------------- ADD TO CART ----------------------
  const handleAddToCart = async (item) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first!");
      return;
    }

    const customerId = user.uid;

    try {
      const cartRef = collection(db, "userCart");
      const q = query(cartRef, where("customerId", "==", customerId));
      const cartSnap = await getDocs(q);

      if (cartSnap.empty) {
        // Create new cart
        const newCartRef = doc(collection(db, "userCart"));
        await setDoc(newCartRef, {
          uid: newCartRef.id,
          customerId,
          cart: [
            {
              productId: item.productId,
              sellerProductId: item.sellerProductId,
              sellerId: item.sellerId,
            },
          ],
        });

        alert("Added to cart!");
        return;
      }

      // Update existing cart
      const cartDoc = cartSnap.docs[0];
      const cartData = cartDoc.data();

      const duplicate = cartData.cart.some(
        (c) => c.sellerProductId === item.sellerProductId
      );

      if (duplicate) {
        alert("Item already in cart!");
        return;
      }

      const updatedCart = [
        ...cartData.cart,
        {
          productId: item.productId,
          sellerProductId: item.sellerProductId,
          sellerId: item.sellerId,
        },
      ];

      await updateDoc(doc(db, "userCart", cartDoc.id), {
        cart: updatedCart,
      });

      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // ---------------------- FILTER ----------------------
  const filteredData = mergedData.filter((item) => {
    return (
      (!division || item.location.division === division) &&
      (!district || item.location.district === district) &&
      (!thana || item.location.thana === thana) &&
      (!area || item.location.area === area)
    );
  });

  return (
    <div className="buyer-product-content">
      <h3>Product List</h3>

      <div className="location-selector">
        {/* Division */}
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
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
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
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
          </select>
        </div>

        {/* Thana */}
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
                <option key={th} value={th}>
                  {th}
                </option>
              ))}
          </select>
        </div>

        {/* Area */}
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
                <option key={ar} value={ar}>
                  {ar}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* ---------------------- TABLE ---------------------- */}
      <table className="buyer-product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Shop Name</th>
            <th>Area</th>
            <th>Shop Address</th>
            <th>Price Range</th>
            <th>Seller Price</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td className="buyer-text">{item.productName}</td>
                <td className="buyer-text">{item.shopName}</td>
                <td className="buyer-text">{item.location.area}</td>
                <td className="buyer-text">{item.shopAddress}</td>
                <td className="buyer-text">
                  {item.lowestRange && item.highestRange
                    ? `${item.lowestRange} - ${item.highestRange}`
                    : "-"}
                </td>
                <td className="buyer-text">{item.sellingPrice}</td>
                <td className="buyer-text">{item.unit}</td>

                <td>
                  <button
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
