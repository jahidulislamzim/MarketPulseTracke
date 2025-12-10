import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../../auth/firebase.init"; 
import './Report.css';

const Report = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [subject, setSubject] = useState("");
  const [complaint, setComplaint] = useState("");
  const [viewReport, setViewReport] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "seller"));
        const querySnapshot = await getDocs(q);
        const sellersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSellers(sellersList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsRef = collection(db, "reports");
        const snapshot = await getDocs(reportsRef);
        const reportList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(reportList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReports();
  }, []);

  const resetForm = () => {
    setSelectedSeller("");
    setSubject("");
    setComplaint("");
  };

  const handleReportSubmit = async () => {
    if (!selectedSeller || !subject || !complaint) return;

    const reportsRef = collection(db, "reports");
    const newDocRef = doc(reportsRef);
    const newReport = {
      uid: newDocRef.id,
      sellerUid: selectedSeller,
      subject,
      complaint,
      status: "Pending",
      Customeruid: auth.currentUser?.uid
    };

    try {
      await setDoc(newDocRef, newReport);
      setReports(prev => [...prev, newReport]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = (report) => {
    setViewReport(report);
  };

  return (
    <div className="user-report-content">
      <h3>User Reports List</h3>
      <button className="user-report-add-btn blue-btn" onClick={() => setIsModalOpen(true)}>Add Report</button>

      <table className="user-report-table">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Shop Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No reports found</td>
            </tr>
          ) : (
            reports.map(report => (
              <tr key={report.id}>
                <td>{report.subject}</td>
                <td>{sellers.find(s => s.id === report.sellerUid)?.name || report.sellerUid}</td>
                <td className={`user-report-status user-report-${report.status.toLowerCase()}`}>{report.status}</td>
                <td>
                  <button className="user-report-view-btn" onClick={() => handleView(report)}>View</button>
                  <button className="user-report-delete-btn" onClick={() => handleDelete(report.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="user-report-modal">
          <div className="user-report-modal-content">
            <h4>Add New Report</h4>
            <label>Seller:</label>
            <select value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
              <option value="">Select a seller</option>
              {sellers.map(seller => <option key={seller.id} value={seller.id}>{seller.name}</option>)}
            </select>

            <label>Subject:</label>
            <input type="text" placeholder="Enter report subject" value={subject} onChange={(e) => setSubject(e.target.value)} />

            <label>Complaint:</label>
            <textarea placeholder="Enter your complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} />

            <div className="user-report-modal-buttons">
              <button className="user-report-report-btn" onClick={handleReportSubmit} disabled={!selectedSeller || !subject || !complaint}>Report</button>
              <button className="user-report-cancel-btn" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {viewReport && (
        <div className="user-report-modal">
          <div className="user-report-modal-content">
            <h4>Report Details</h4>
            <p><strong>Subject:</strong> {viewReport.subject}</p>
            <p><strong>Complaint:</strong> {viewReport.complaint}</p>
            <p><strong>Status:</strong> {viewReport.status}</p>
            <div className="user-report-modal-buttons">
              <button className="user-report-cancel-btn" onClick={() => setViewReport(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
