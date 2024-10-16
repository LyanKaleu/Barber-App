import React, { useContext } from 'react';

import { GlobalContext } from "../context/GlobalProvider";

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'

const Routes: React.FC = () => {
    const { loading, user } = useContext(GlobalContext);

    if (loading) {
        return null;
    }
    
    return user ? <AppRoutes /> : <AuthRoutes />
}

export default Routes;