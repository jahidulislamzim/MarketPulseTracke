import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <h1 className="loading-title">Market Pulse Tracker</h1>
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loading-text">Fetching the latest market insights...</p>
    </div>
  );
};

export default Loading;
