import React from "react";
import './User.css'

const Report = () => {
  return (
    <div class="content">
      <h3>Seller List</h3>

      <table class="report-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shop Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Kamal</td>
            <td>ABC Store</td>
            <td class="status success">Active</td>
            <td>
              <button class="view-btn">View</button>
            </td>
          </tr>

          <tr>
            <td>Munna Bhai</td>
            <td>XYZ Mart</td>
            <td class="status pending">Pending</td>
            <td>
              <button class="view-btn">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Report;
