import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import MyList from "../pages/Buyer/MyList/MyList";
import Profile from "../pages/Buyer/Profile/Profile";
import Report from "../pages/Buyer/Report/Report";
import Login from "../pages/Login/Login";
import AdminReport from "../pages/Admin/Report/Report";
import User from "../pages/Admin/User/User";

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
      {
        path: "/admin/report",
        Component: AdminReport,
      },
      {
        path: "/admin/user",
        Component: User,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },
]);

export default router;
