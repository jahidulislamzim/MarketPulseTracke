import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import MyList from "../pages/Buyer/MyList/MyList";
import Profile from "../pages/Buyer/Profile/Profile";
import Report from "../pages/Buyer/Report/Report";
import Login from "../pages/Login/Login";
import AdminReport from "../pages/Admin/Report/Report";
import AdminProduct from "../pages/Admin/Product/Product";
import AdminProfile from "../pages/Admin/Profile/Profile";
import User from "../pages/Admin/User/User";
import SellerProfile from "../pages/Seller/Profile/Profile";
import SellerProduct from "../pages/Seller/Product/Product";
import Registration from "../pages/Registration/Registration";

import UniversalRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public Home Page
      {
        index: true,
        element: <Home />,
      },

      // --------------------- BUYER ROUTES ---------------------
      {
        path: "/buyer/my-list",
        element: (
          <UniversalRoute authRequired={true} roles={["buyer"]}>
            <MyList />
          </UniversalRoute>
        ),
      },
      {
        path: "/buyer/profile",
        element: (
          <UniversalRoute authRequired={true} roles={["buyer"]}>
            <Profile />
          </UniversalRoute>
        ),
      },
      {
        path: "/buyer/report",
        element: (
          <UniversalRoute authRequired={true} roles={["buyer"]}>
            <Report />
          </UniversalRoute>
        ),
      },

      // --------------------- ADMIN ROUTES ---------------------
      {
        path: "/admin/report",
        element: (
          <UniversalRoute authRequired={true} roles={["admin"]}>
            <AdminReport />
          </UniversalRoute>
        ),
      },
      {
        path: "/admin/user",
        element: (
          <UniversalRoute authRequired={true} roles={["admin"]}>
            <User />
          </UniversalRoute>
        ),
      },
      {
        path: "/admin/product",
        element: (
          <UniversalRoute authRequired={true} roles={["admin"]}>
            <AdminProduct />
          </UniversalRoute>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <UniversalRoute authRequired={true} roles={["admin"]}>
            <AdminProfile />
          </UniversalRoute>
        ),
      },

      // --------------------- SELLER ROUTES ---------------------
      {
        path: "/seller/profile",
        element: (
          <UniversalRoute authRequired={true} roles={["seller"]}>
            <SellerProfile />
          </UniversalRoute>
        ),
      },
      {
        path: "/seller/product",
        element: (
          <UniversalRoute authRequired={true} roles={["seller"]}>
            <SellerProduct />
          </UniversalRoute>
        ),
      },

      // --------------------- PUBLIC AUTH PAGES ---------------------
      {
        path: "/login",
        element: (
          <UniversalRoute authRequired={false}>
            <Login />
          </UniversalRoute>
        ),
      },
      {
        path: "/registration",
        element: (
          <UniversalRoute authRequired={false}>
            <Registration />
          </UniversalRoute>
        ),
      },
    ],
  },
]);

export default router;
