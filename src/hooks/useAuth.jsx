import { useContext } from 'react';
import { AuthContext } from '../context/Auth/AuthContext';


const useAuth = () => {
    const authInfo = useContext(AuthContext);
    return authInfo;
};

export default useAuth;
