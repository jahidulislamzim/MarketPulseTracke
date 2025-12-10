import React, { useEffect, useState } from "react";
import "./MyList.css"; // updated CSS file name
import { auth, db } from "../../../auth/firebase.init";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const MyList = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userCartQ = query(
          collection(db, "userCart"),
          where("customerId", "==", user.uid)
        );
        const cartSnap = await getDocs(userCartQ);
        if (cartSnap.empty) return;

        const cartDoc = cartSnap.docs[0];
        const cartArray = cartDoc.data().cart;
        if (!cartArray || cartArray.length === 0) {
          setCartItems([]);
          return;
        }

        const [productsSnap, usersSnap, sellerProductsSnap, sellersSnap] =
          await Promise.all([
            getDocs(collection(db, "products")),
            getDocs(collection(db, "users")),
            getDocs(collection(db, "sellerProducts")),
            getDocs(collection(db, "sellers")),
          ]);

        const products = productsSnap.docs.map((d) => ({
          pid: d.id,
          ...d.data(),
        }));
        const users = usersSnap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        }));
        const sellerProducts = sellerProductsSnap.docs.map((d) => ({
          spid: d.id,
          ...d.data(),
        }));
        const sellers = sellersSnap.docs.map((d) => ({
          sid: d.id,
          ...d.data(),
        }));

        const merged = cartArray.map((cartItem) => {
          const sp = sellerProducts.find(
            (s) => s.spid === cartItem.sellerProductId
          );
          const product = products.find((p) => p.pid === cartItem.productId);
          const userSeller = users.find((u) => u.uid === cartItem.sellerId);
          const sellerInfo = sellers.find((s) => s.sid === cartItem.sellerId);

          return {
            cartSellerProductId: cartItem.sellerProductId,
            productName: product?.productName ?? "-",
            lowestRange: product?.lowestRange ?? "-",
            highestRange: product?.highestRange ?? "-",
            unit: product?.unit ?? "-",
            sellingPrice: sp?.sellingPrice ?? "-",
            sellingUnit: sp?.unit ?? "-",
            lastUpdate_sp: sp?.lastUpdate ?? "-",
            sellerName: userSeller?.name ?? "-",
            email: userSeller?.email ?? "-",
            isVerified: userSeller?.isVerified ?? false,
            role: userSeller?.role ?? "-",
            location: userSeller?.location ?? {},
            shopName: sellerInfo?.shopName ?? "-",
            shopAddress: sellerInfo?.shopAddress ?? "-",
            tin: sellerInfo?.tin ?? "-",
          };
        });

        setCartItems(merged);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (spId) => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "userCart"),
      where("customerId", "==", user.uid)
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const cartDoc = snap.docs[0];
    const oldCart = cartDoc.data().cart;
    const updatedCart = oldCart.filter((item) => item.sellerProductId !== spId);

    await updateDoc(doc(db, "userCart", cartDoc.id), { cart: updatedCart });

    setCartItems((prev) =>
      prev.filter((item) => item.cartSellerProductId !== spId)
    );
  };

  const handleCompare = () => {
    const lowestPriceMap = {};
    cartItems.forEach((item) => {
      const name = item.productName;
      if (
        !lowestPriceMap[name] ||
        item.sellingPrice < lowestPriceMap[name].sellingPrice
      ) {
        lowestPriceMap[name] = item;
      }
    });
    setCartItems(Object.values(lowestPriceMap));
  };

  return (
    <div className="user-cart-content">
      <h3>User Cart</h3>

      <button
        className="user-cart-compare-btn"
        onClick={handleCompare}
      >
        Compare
      </button>

      <table className="user-cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price Range</th>
            <th>Seller Price</th>
            <th>Shop</th>
            <th>Seller</th>
            <th>Area</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.cartSellerProductId}>
                <td>{item.productName}</td>
                <td>{item.lowestRange} - {item.highestRange}</td>
                <td>{item.sellingPrice}</td>
                <td>{item.shopName}</td>
                <td>{item.sellerName}</td>
                <td>{item.location?.area}</td>
                <td>
                  <button
                    className="user-cart-delete-btn"
                    onClick={() => handleDelete(item.cartSellerProductId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No items in your cart
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyList;
