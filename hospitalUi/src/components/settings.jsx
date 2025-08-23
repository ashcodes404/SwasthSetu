import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    // Redirect to login/landing page
    navigate("/", { replace: true });
  };

  return (
    <div className="netPage flex h-screen w-full">
    <div className="Navbar h-screen  w-[20%]">

<Navbar/>
    </div>
    <div className="p-6 workspace bg-blue-600 h-screen w-[80%]">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

    
   
    </div>
    </div>
  );
};

export default Dashboard;
