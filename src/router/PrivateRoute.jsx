// import { Navigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useState, useEffect } from "react";

// const PrivateRoute = ({ children }) => {
//   const location = useLocation();
//   const doctorData = localStorage.getItem("doctor-app");
//   const [shouldRedirect, setShouldRedirect] = useState(false);

//   useEffect(() => {
//     if (!doctorData) {
//       toast.error("Please Login First");
//       setShouldRedirect(true);
//     }
//   }, [doctorData]);

//   if (shouldRedirect) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   if (!doctorData) {
//     return null; // Show nothing while waiting
//   }

//   return children;
// };

// export default PrivateRoute;
//

import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const doctorData = localStorage.getItem("doctor-app");
  // console.log(doctorData, "doctorDatadoctorDatadoctorData");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // PUBLIC ROUTES (no login required)
  const PUBLIC_ROUTES = ["/invited-user-join"];
  // Check if current location starts with allowed prefix
  const isPublic = PUBLIC_ROUTES.some((r) => location.pathname.startsWith(r));
  // console.log("linked call", isPublic);
  useEffect(() => {
    if (!doctorData && !isPublic) {
      toast.error("Please Login First");
      setShouldRedirect(true);
    }
  }, [doctorData, isPublic]);

  if (shouldRedirect) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Allow public routes
  if (isPublic) {
    return children;
  }

  if (!doctorData) {
    return null; // blank while checking
  }

  return children;
};

export default PrivateRoute;
