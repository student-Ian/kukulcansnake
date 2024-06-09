import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import AdminRoutes from "./AdminRoutes";
import ClientRoutes from "./ClientRoutes";

const CustomRoutes = () => {
    return (
        <Routes>
            <Route path="/admin/*" element={<AdminRoutes/>}/>
            <Route path="*" element={<ClientRoutes/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
};

export default CustomRoutes;
