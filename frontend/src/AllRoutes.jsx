// src/AllRoutes.jsx
import { Routes, Route } from "react-router-dom";
import App from "./App";
import AuthCallback from "./components/AuthCallback";


const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<App />} />
        </Routes>
    );
};

export default AllRoutes;
