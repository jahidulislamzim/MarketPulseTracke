import React from "react";
import './Product.css';

const Report = () => {
  // Example data with last update time
  const products = [
    {
      name: "Monthly Sales Report",
      price: "ABC Store",
      lastUpdate: "2025-12-01 14:00",
      status: "Resolved",
    },
    {
      name: "Bad Product Report",
      price: "XYZ Mart",
      lastUpdate: "2025-11-30 10:30",
      status: "Pending",
    },
  ];

  return (
    <div className="content">
      <h3>Product List</h3>
      <table className="report-table">
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
              <td className="status">
                {product.lastUpdate}
              </td>
              <td>
                <button className="view-btn">View</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
