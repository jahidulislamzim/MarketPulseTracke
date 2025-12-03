# Market Pulse Tracker

### **Transparent Prices. Empowered Buyers. Corruption-Free Market.**

Market Pulse Tracker is a MERN-powered platform designed to **monitor real market prices**, empower local buyers, support honest sellers, and prevent price manipulation or syndicates.
It ensures **accurate, location-based product pricing** and maintains fairness through a powerful **Admin–Seller–Buyer** ecosystem.

---

## 🔗 Live Demo

**Website:** [Click Here](https://market-pulse-tracke.vercel.app/)

---

# Project Overview

Market Pulse Tracker is a real-time **market price monitoring system** where Admins define price ranges, Sellers must follow them, and Buyers can view accurate prices and report any irregularities.
The system helps fight corruption, price syndication, and misinformation—ensuring **market transparency** for everyone.

---

# Tech Stack

* React.js
* CSS
* React Hook Form
* Firebase Authentication
* Vite

---

# Core Features

### **Accurate Price Monitoring**

* Admin defines **Minimum, Maximum & Recommended Prices**
* Sellers must follow Admin-approved price ranges
* Buyers see real-time, location-based prices

### **Role-Based System**

* Admin, Seller, and Buyer have separate responsibilities and dashboards

### **Price Integrity Enforcement**

* Automatic rejection if sellers input a price outside Admin-defined range
* Buyers can report incorrect pricing
* Admin can warn or block dishonest sellers

### **Location-Based Price Discovery**

* Buyers see prices of nearby shops
* Shows **Lowest Price Shops** for each product

### **Comparisons & Analytics**

* Compare shop prices
* View shop ranking
* Track price changes

### **Secure Authentication**

* Firebase Auth + JWT
* Protected Routes
* Session handling & auto logout

### **Responsive UI**

* Mobile-friendly layouts
* Smooth animations with Framer Motion
* Card & table view toggle

---

# User Roles & Requirements

## Admin Requirements

Admins control the entire pricing ecosystem.

### Admin Powers:

* Set **minimum, maximum, and recommended** prices for each product
* Approve or reject seller price entries
* Review buyer reports
* Issue warnings or block sellers
* Update shop data, product info, and price ranges
* Maintain system fairness & transparency

### Admin Guarantees:

* Honest market pricing
* Prevention of corruption or syndicates
* Consistent product information

---

## Seller Requirements

Sellers upload their product prices—but must follow Admin rules.

### Seller Responsibilities:

* Add products **within Admin-approved price ranges**
* Manage stock, price updates, and shop details
* Ensure price accuracy; no misleading information
* Cooperate with Admin investigations
* Update prices if Admin requires it

### Seller Limitations:

* Prices outside the allowed range = **auto rejection**
* If reported by buyer, must face Admin review

---

## Buyer Requirements

Buyers use the system to find the most accurate and fair prices.

### Buyer Features:

* View real-time, **location-based prices**
* Discover **Lowest Price Shops**
* Compare shops by price, distance, and ranking
* Report price discrepancies (e.g., shop charges more than shown)
* Optional notifications for price drops & offers (future update)

### Buyer Benefits:

* Transparency
* Fair market knowledge
* Protection from overpricing and syndicate manipulation

---


# Local Setup Guide

## Prerequisites

* Node.js v16+
* Firebase Project
* Git

---

## Client Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/jahidulislamzim/MarketPulseTracke
   cd MarketPulseTracke
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create `.env.local`:

   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5000
   ```

---


## Acknowledgments

* **React.js** – Frontend UI development
* **Row CSS** – Simple and clean custom CSS styling
* **Firebase** – Authentication and real-time database
* **VS Code** – Main development environment
* **Vercel** – Deployment and hosting platform  



---

<div align="center">
  <h3><strong>Market Pulse Tracker</strong></h3>
  <p>Fair Prices • Safe Market • Empowered Community</p>
  <p>
    Built with ❤️ by <br>
    1. Jahidul Islam <br>
    2. Jannatun Naem Refat <br>
    3. Rashid Shahriar <br>
    4. Sagor Ahmed <br>
    5. Aminul Islam Rupak
  </p>
</div>

