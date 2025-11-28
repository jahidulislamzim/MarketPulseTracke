import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';

let router = createBrowserRouter([
    {
        path:"/",
        Component: App,
        children:[
           {
            index: true,
            Component: Home
           }
        ]
    }
]);

export default router;