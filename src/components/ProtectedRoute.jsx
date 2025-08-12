import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "./Loader"; // Import the loader component you made

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />; // Show loader while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
