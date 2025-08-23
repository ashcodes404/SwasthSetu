// src/components/AuthHandler.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If logged in and on landing page → go to dashboard
    if (token && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }

    // If not logged in and trying to access dashboard → go to landing/login
    if (!token && location.pathname === "/dashboard") {
      navigate("/", { replace: true });
    }
  }, [navigate, location]);

  return null; // nothing visible, only handles redirects
};

export default AuthHandler;
