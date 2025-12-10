import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../auth/firebase.init";
import './Report.css';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsSnapshot = await getDocs(collection(db, "reports"));
        const usersSnapshot = await getDocs(collection(db, "users"));
        const sellersSnapshot = await getDocs(collection(db, "sellers"));

        const users = {};
        usersSnapshot.docs.forEach(doc => {
          users[doc.id] = doc.data();
        });

        const sellers = {};
        sellersSnapshot.docs.forEach(doc => {
          sellers[doc.id] = doc.data();
        });

        const reportData = reportsSnapshot.docs.map(doc => {
          const data = doc.data();
          const user = users[data.sellerUid];
          const seller = sellers[data.sellerUid];

          return {
            id: doc.id,
            reportName: data.subject || "No Subject",
            complaint: data.complaint,
            status: data.status,
            sellerName: seller?.shopName || "Unknown Shop",
            shopName: seller?.shopName || "Unknown Shop",
            location: user
              ? `${user.location.area}, ${user.location.thana}, ${user.location.district}, ${user.location.division}`
              : "Unknown Location",
          };
        });

        setReports(reportData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleView = (report) => {
    setSelectedReport(report);
    setStatus(report.status);
  };

  const handleUpdate = async () => {
    if (!selectedReport) return;

    try {
      // Update Firestore
      const reportRef = doc(db, "reports", selectedReport.id);
      await updateDoc(reportRef, { status });

      // Update local state
      setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status } : r));
      setSelectedReport(null);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const handleCancel = () => {
    setSelectedReport(null);
  };

  return (
    <div className="admin-content">
      <h3>Reports List</h3>

      <table className="admin-report-table">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Shop Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.reportName}</td>
              <td>{report.shopName}</td>
              <td className={`admin-status ${report.status.toLowerCase()}`}>{report.status}</td>
              <td>
                <button className="admin-view-btn" onClick={() => handleView(report)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReport && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h4>Report Details</h4>
            <p><strong>Seller Name:</strong> {selectedReport.sellerName}</p>
            <p><strong>Shop Name:</strong> {selectedReport.shopName}</p>
            <p><strong>Location:</strong> {selectedReport.location}</p>
            <p><strong>Complaint:</strong> {selectedReport.complaint}</p>

            <label>Status:</label>
            <select className="admin-dropdown" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>

            <div className="admin-modal-buttons">
              <button className="admin-update-btn" onClick={handleUpdate}>Update</button>
              <button className="admin-cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
