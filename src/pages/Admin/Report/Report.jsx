import React from "react";
import './Report.css'

const Report = () => {
  return (
    <div class="content">
      <h3>Reports List</h3>

      <table class="report-table">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Shop Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Monthly Sales Report</td>
            <td>ABC Store</td>
            <td class="status success">Resolved</td>
            <td>
              <button class="view-btn">View</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>

          <tr>
            <td>Bad Product Report</td>
            <td>XYZ Mart</td>
            <td class="status pending">Pending</td>
            <td>
              <button class="view-btn">View</button>
              <button class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Report;
