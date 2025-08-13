import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function NotFoundRedirect() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const doctorData = localStorage.getItem("doctor-app");
        
        if (doctorData) {
            // Doctor is logged in - redirect to doctor-home
            toast.error("The URL you entered does not exist. Redirected to home.");
            navigate("/doctor-home", { replace: true });
        } else {
            // Doctor is not logged in - redirect to login page
            toast.error("Please login first");
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return null;
}

export default NotFoundRedirect;