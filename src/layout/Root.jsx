import React, { useState } from 'react';
import Header from '../component/Header/Header';
import { Outlet } from "react-router-dom";
import Loading from '../component/Loading/Loading';
import useAuth from '../hooks/useAuth';


const Root = () => {
    const {loading} = useAuth();


    if(loading){
        return <Loading/>
    }

    return (
        <>
            <Header /> 
             <Outlet />
        </>
    );
};

export default Root;
