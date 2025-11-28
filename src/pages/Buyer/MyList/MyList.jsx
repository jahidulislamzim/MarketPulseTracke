import React from "react";
import './MyList.css'
const MyList = () => {
  return (
    <div className="content">
      <h3>Your Cart</h3>

      {/* <div className="location-select">
    <label for="location">Select Location:</label>
    <select id="location">
      <option value="dhaka">Dhaka</option>
      <option value="chittagong">Chittagong</option>
      <option value="rajshahi">Rajshahi</option>
      <option value="khulna">Khulna</option>
      <option value="barishal">Barishal</option>
    </select>
  </div> */}

      <table>
        <tr>
          <th>Name</th>
          <th>Admin Price</th>
          <th>Lowest Price</th>
          <th>Shop</th>
          <th>Action</th>
        </tr>
        <tr>
          <td>Example Product</td>
          <td>2000</td>
          <td>1500</td>
          <td>Shop ABC</td>
          <td>
            <button className="del">Delete</button>
          </td>
        </tr>
        <tr>
          <td>Product 2</td>
          <td>3500</td>
          <td>3200</td>
          <td>Shop XYZ</td>
          <td>
            <button className="del">Delete</button>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default MyList;
