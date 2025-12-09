import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, authRequired = false, roles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div>
                <span>loading</span>
            </div>
        );
    }


    if (!authRequired && user) {
        const from = location.state?.from || "/"; 
        return <Navigate to={from} replace />;
    }

    
    if (authRequired && !user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }


    if (roles.length > 0 && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
