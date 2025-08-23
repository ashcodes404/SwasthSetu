import React, { createContext, useState, useEffect } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children, hospitalId }) => {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = async () => {
    if (!hospitalId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/dashboard/${hospitalId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const intervalId = setInterval(fetchDashboard, 15000); // Poll every 15 seconds
    return () => clearInterval(intervalId);
  }, [hospitalId]);

  return (
    <DashboardContext.Provider value={{ dashboardData, fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};
