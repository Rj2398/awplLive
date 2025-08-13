import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const doctorData = localStorage.getItem("doctor-app");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!doctorData) {
      toast.error("Please Login First");
      setShouldRedirect(true);
    }
  }, [doctorData]);

  if (shouldRedirect) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!doctorData) {
    return null; // Show nothing while waiting
  }

  return children;
};

export default PrivateRoute;
