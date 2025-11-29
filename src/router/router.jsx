import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import MyList from '../pages/Buyer/MyList/MyList';
import Profile from '../pages/Buyer/Profile/Profile';
import Report from '../pages/Buyer/Report/Report';

let router = createBrowserRouter([
    {
        path:"/",
        Component: App,
        children:[
           {
            index: true,
            Component: Home
           },
           {
            path: "/buyer/my-list",
            Component: MyList
           },
           {
            path: "/buyer/profile",
            Component: Profile
           },
           {
            path: "/buyer/report",
            Component: Report
           }
        ]
    }
]);

export default router;