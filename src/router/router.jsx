import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import MyList from "../pages/Buyer/MyList/MyList";
import Profile from "../pages/Buyer/Profile/Profile";
import Report from "../pages/Buyer/Report/Report";
import Login from "../pages/Login/Login";
import AdminReport from "../pages/Admin/Report/Report";
// import AdminProduct from "../pages/Admin/Product/Product";
import AdminProfile from "../pages/Admin/Profile/Profile";
import User from "../pages/Admin/User/User";

import SellerProfile from "../pages/Seller/Profile/Profile"
import SellerProduct from "../pages/Seller/Product/Product"
import Registration from "../pages/Registration/Registration";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/buyer/my-list",
        Component: MyList,
      },
      {
        path: "/buyer/profile",
        Component: Profile,
      },
      {
        path: "/buyer/report",
        Component: Report,
      },
      // Admin Route 
      {
        path: "/admin/report",
        Component: AdminReport,
      },
      {
        path: "/admin/user",
        Component: User,
      },
      // {
      //   path: "/admin/product",
      //   Component: AdminProduct,
      // },
      {
        path: "/admin/profile",
        Component: AdminProfile,
      },

      // Seller Route 
      {
        path: "/seller/profile",
        Component: SellerProfile,
      },
      {
        path: "/seller/product",
        Component: SellerProduct,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/registration",
        Component: Registration,
      },
    ],
  },
]);

export default router;
