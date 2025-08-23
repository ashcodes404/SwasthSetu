import React, { createContext, useContext, useState } from "react";

// Create AppointmentContext
const AppointmentContext = createContext();

// Helper to create empty daywise structure
const emptyDaywise = {
  dates: [],
  incoming: [],
  completed: [],
  cancelled: [],
  ongoing: [],
};

// Provider component
export const AppointmentProvider = ({ children }) => {
  // Total counts of appointments
  const [counts, setCounts] = useState({ upcoming: 0, completed: 0 });
  // Hospital ID currently selected/logged in
  const [hospitalId, setHospitalId] = useState(null);
  // Daywise appointment data for graphs
  const [daywiseData, setDaywiseData] = useState(emptyDaywise);

  // Function to update both counts and daywise data together
  const updateAppointmentData = ({ upcomingCount, completedCount, daywise }) => {
    setCounts({ upcoming: upcomingCount, completed: completedCount });
    setDaywiseData(daywise);
  };

  return (
    <AppointmentContext.Provider
      value={{
        counts,
        setCounts,
        hospitalId,
        setHospitalId,
        daywiseData,
        setDaywiseData,
        updateAppointmentData,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook for easy usage of AppointmentContext in components
export const useAppointment = () => useContext(AppointmentContext);
